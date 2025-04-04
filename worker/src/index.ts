import { Hono } from 'hono';
import * as countries from 'i18n-iso-countries';
import countryDataEn from 'i18n-iso-countries/langs/en.json';
import { detectAbusiveText, detectValidCompany, getCompanyEntry, lookupCompanyGemini, lookupCompanyV2, updateCountryCode } from './company-lookup';
import { getProductByEan, saveChangeRequest, saveProductInDb } from './products-update';
import { getCompanyOrigin } from './isEuropeanCountry';

countries.registerLocale(countryDataEn);

const app = new Hono<{ Bindings: Env }>();
export default app;

const cacheVersion = 1;

app.post('/change-request', async (c) => {
	try {
		const body = await c.req.json();
		const data:ChangeRequest = body;

		const changeRequestData:ChangeRequestData = JSON.parse(data.data ?? '');
		let companyName :string | null = changeRequestData.company;
		let countryCode:string | null = changeRequestData.companyCountryCode;
		let parentCompany:string | null = changeRequestData.parentCompany;

		if (companyName == null || companyName.trim() == '' || companyName == 'N/A') {
			// do not save if company is not given
			return;
		}

		const validCompany = await detectValidCompany(c.env, changeRequestData.company);
		if (!validCompany.valid) {
			// no valid company
			return;
		}

		if (countryCode == null || countryCode.trim() == '' || countryCode.trim() == 'N/A') {
			countryCode = null;
		}
	
		if (parentCompany == null || parentCompany.trim() == '' || parentCompany.trim() == 'N/A') {
			parentCompany = null;
		}

		if (countryCode == null && parentCompany == null) {
			// do not save if no data is given
			return;
		}

		const company = await updateCountryCode(c.env, { tag: companyName, countryCode: countryCode, parentCompany: parentCompany });

		await saveChangeRequest(c.env, data);

		return c.json({ message: 'Product saved successfully', data: { company} }, 200);
	} catch (error) {
        console.error('Error saving product:', error);
        return c.json({ error: { code: `internal_error ${error}`, message: 'Internal server error' } }, 500);
    }
});

app.post('/new-product', async (c) => {
    try {
        const body = await c.req.json();
        const product:LocalProduct = body;

        if (!product) {
            return c.json({ error: { code: 'invalid_request', message: 'Missing required fields product' } }, 400);
        }

		const isAbusive = await detectAbusiveText(c.env, JSON.stringify(body));

		await saveProductInDb(c.env, product, isAbusive['abusive']);
        

        return c.json({ message: 'Product saved successfully', data: { product} }, 200);
    } catch (error) {
        console.error('Error saving product:', error);
        return c.json({ error: { code: 'internal_error', message: 'Internal server error' } }, 500);
    }
});

async function fetchProductFromLocalDb(c, code: string) {
	try {
		if (!code) {
			return null;
		}

		let product = await getProductByEan(c.env, code);
		if (product) {
			product.data = JSON.parse(product?.data ?? '');
		}
		
		return product
	} catch(e) {
		console.error('Error:', e);
		return null;
	}
}

app.get('/local-product', async(c) => {
	const code = c.req.query('code');

	if (!code) {
		return c.json({ error: { code: 'invalid_request', message: 'Code parameter is required' } }, 400);
	}

	const localProduct = await fetchProductFromLocalDb(c, code);
	return c.json(localProduct ?? null);
});

app.get('/product', async (c) => {
	try {
		const code = c.req.query('code');

		if (!code) {
			return c.json({ error: { code: 'invalid_request', message: 'Code parameter is required' } }, 400);
		}

		const productInfo = await getProduct(code, c);

		if (productInfo.error) {
			return c.json(productInfo, 400);
		}

		const companyInfo = await lookupCompanyV2(c.env, { name: productInfo.brands, tag: productInfo.brands_tags[0] });

		const companyOrigin = getCompanyOrigin(companyInfo.company.isoCountryCode, companyInfo.parentCompany?.isoCountryCode);

		return c.json({
			data: {
				code: code,
				name: productInfo.product_name,
				imageUrl: productInfo.image_front_url,
				base64Image: productInfo.base_64_image,
				company: {
					name: companyInfo.company.name,
					country: (companyInfo.company.isoCountryCode && countries.getName(companyInfo.company.isoCountryCode, 'en')) ?? null,
					countryCode: companyInfo.company.isoCountryCode,
				},
				parentCompany: companyInfo.parentCompany
					? {
							name: companyInfo.parentCompany.name,
							country:
								(companyInfo.parentCompany.isoCountryCode && countries.getName(companyInfo.parentCompany.isoCountryCode, 'en')) ?? null,
							countryCode: companyInfo.parentCompany.isoCountryCode,
					  }
					: null,
				companyOrigin,
			},
		} satisfies ProductInfoResponse);
	} catch (error) {
		console.error(error);
		return c.json({ error: { code: 'internal_error', message: 'Internal server error' } }, 500);
	}
});

app.get('/company_request', async(c) => {
	const name = c.req.query('name');
	if (!name) {
		return c.json({ error: 'Name parameter is required' }, 400);
	}

	const company = await getCompanyEntry(c.env, { name: name, tag: name });

	return c.json({ data: company });
});

app.get('/update_country_code', async(c) => {
	const name = c.req.query('name');
	const countryCode = c.req.query('countryCode') || null;
	const parentCompany = c.req.query('parentCompany') || null;
	if (!name) {
		return c.json({ error: 'Name parameter is required' }, 400);
	}

	// remove old entry from cache
	await c.env.BUY_EUROPEAN_KV.delete(`company:${name}:${cacheVersion}`);

	const company = await updateCountryCode(c.env, { tag: name, countryCode: countryCode, parentCompany: parentCompany });

	return c.json({ data: {'result': company, 'name': name, 'countryCode': countryCode, 'parentCompany': parentCompany,} });
});

// app.get('/abusive', async(c) => {
// 	const text = c.req.query('text');
// 	if (!text) {
// 		return c.json({ error: 'Text parameter is required' }, 400);
// 	}
// 	const result = await detectAbusiveText(c.env, text);
// 	return c.json({ data: result });
// });

// app.get('/valid-company', async(c) => {
// 	const text = c.req.query('text');
// 	if (!text) {
// 		return c.json({ error: 'Text parameter is required' }, 400);
// 	}
// 	const result = await detectValidCompany(c.env, text);
// 	return c.json({ data: result });
// });

app.get('/company', async (c) => {
	const name = c.req.query('name');
	if (!name) {
		return c.json({ error: 'Name parameter is required' }, 400);
	}

	// Caching:
	const data = await c.env.BUY_EUROPEAN_KV.get(`company:${name}:${cacheVersion}`);
	if (data) {
		console.log(`Cache hit "${name}"`);
		return c.json({ data: JSON.parse(data) });
	}

	console.log(`Cache miss "${name}"`);

	const companyInfo = await lookupCompanyGemini(c.env, name);
	await c.env.BUY_EUROPEAN_KV.put(`company:${name}:${cacheVersion}`, JSON.stringify(companyInfo));

	return c.json({ data: companyInfo });
});


async function getProduct(code: string, c: any) {
	async function fetchOpenFoodFactsProduct(code: string) {
		const url = `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}.json`;
		const response = await fetch(url, {
			headers: {
				'User-Agent': `Buy European - API`,
			},
		});
		return (await response.json()) as any;
	}

	async function fetchOpenBeautyFactsProduct(code: string) {
		const url = `https://world.openbeautyfacts.org/api/v3/product/${encodeURIComponent(code)}.json`;
		const response = await fetch(url, {
			headers: {
				'User-Agent': `Buy European - API`,
			},
		});
		return (await response.json()) as any;
	}

	try {
		const [foodProduct, beautyProduct] = await Promise.all([fetchOpenFoodFactsProduct(code), fetchOpenBeautyFactsProduct(code)]);
		const localProduct = await fetchProductFromLocalDb(c, code);

		let product = foodProduct;
		if (product.status === 'failure') {
			product = beautyProduct;
		}
		

		// const { country, origin } = getCountryFromEAN(code) || { country: null, origin: null };

		if (product.status === 'failure' && localProduct == null) {
			console.log('off rq error', product);
			if (product.result.id === 'product_not_found' || product.result.id === 'product_found_with_a_different_product_type') {
				return { error: { code: 'not_found', message: 'Product not found' } };
			} else {
				return { error: { code: 'internal_error', message: 'Error fetching product from API' } };
			}
		} else {
			const p = product.product;
			return {
				product_name: localProduct?.name ?? p?.product_name,
				brands: localProduct?.data?.company?.name ?? p?.brands,
				brands_tags: localProduct?.data?.company?.name != null ? [localProduct?.data?.company?.name] : p?.brands_tags,
				image_front_url: p?.image_front_url, // TODO: how to do it with base64
				base_64_image: localProduct?.data?.base64image,
			};
		}
	} catch (error) {
		return { error: { code: 'internal_error', message: 'Error fetching product from API' } };
	}
}

// async function getCompany(env: Env, name: string, companyTag: string): Promise<CompanyInfoV2> {
// 	// Caching:
// 	// const data = await env.BUY_EUROPEAN_KV.get(`company:${companyTag}:${cacheVersion}`);
// 	// if (data) {
// 	// 	console.log(`Cache hit "${companyTag}"`);
// 	// 	return JSON.parse(data) as CompanyInfoV2;
// 	// }

// 	// console.log(`Cache miss "${name}"`);

// 	const companyInfo = await lookupCompanyV2(env, { name, tag: companyTag });
// 	// await env.BUY_EUROPEAN_KV.put(`company:${companyTag}:${cacheVersion}`, JSON.stringify(companyInfo));
// 	return companyInfo;
// }

// async function fetchCache< T>(env: Env, key: string, fallback: () => T | Promise<T>, options: { skip?: boolean, ttl?: number } = {}) {
// 	if (options.skip) {
// 		return fallback();
// 	}

// 	const data = await env.BUY_EUROPEAN_KV.get(`${key}:${cacheVersion}`);
// 	if (data) {
// 		const dataObj = JSON.parse(data);

// 		if (dataObj.expiresAt && dataObj.expiresAt > Date.now()) {
// 			return dataObj.value;
// 		}
// 	}

// 	const result = await fallback();
// 	await env.BUY_EUROPEAN_KV.put(`${key}:${cacheVersion}`, JSON.stringify({
// 		value: result,
// 		expiresAt: options.ttl ? Date.now() + options.ttl : undefined,
// 	}));
// 	return result;
// }
