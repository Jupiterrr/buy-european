import { Hono } from 'hono';
import * as countries from 'i18n-iso-countries';
import countryDataEn from 'i18n-iso-countries/langs/en.json';
import { lookupCompanyGemini, lookupCompanyV2 } from './company-lookup';
import { getProductByEan } from './products-update';
import { getCompanyOrigin } from './isEuropeanCountry';

countries.registerLocale(countryDataEn);

const app = new Hono<{ Bindings: Env }>();
export default app;

const cacheVersion = 1;

app.get('/local-product', async(c) => {
	const code = c.req.query('code');

	if (!code) {
		return c.json({ error: { code: 'invalid_request', message: 'Code parameter is required' } }, 400);
	}

	async function fetchProductFromLocalDb(code: string) {
		try {
			if (!code) {
				return c.json({ error: 'Name parameter is required' }, 400);
			}
	
			console.log('fetchProductFromLocalDb', c.env);
			const product = await getProductByEan(c.env, code);
			console.log('local product', product);
	
			return c.json({ data: product });
		} catch(e) {
			console.error('Error:', e);
			return c.json({ error: e }, 400);
		}
	}

	const localProduct = fetchProductFromLocalDb(code);
	return localProduct;

	// return {
	// 	product_name: p.product_name,
	// 	brands: p.brands,
	// 	brands_tags: p.brands_tags,
	// 	image_front_url: p.image_front_url,
	// };
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
				company: {
					name: companyInfo.company.name,
					country: (companyInfo.company.isoCountryCode && countries.getName(companyInfo.company.isoCountryCode, 'en')) ?? null,
				},
				parentCompany: companyInfo.parentCompany
					? {
							name: companyInfo.parentCompany.name,
							country:
								(companyInfo.parentCompany.isoCountryCode && countries.getName(companyInfo.parentCompany.isoCountryCode, 'en')) ?? null,
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

		let product = foodProduct;
		if (product.status === 'failure') {
			product = beautyProduct;
		}

		// const { country, origin } = getCountryFromEAN(code) || { country: null, origin: null };

		if (product.status === 'failure') {
			console.log('off rq error', product);
			if (product.result.id === 'product_not_found' || product.result.id === 'product_found_with_a_different_product_type') {
				return { error: { code: 'not_found', message: 'Product not found' } };
			} else {
				return { error: { code: 'internal_error', message: 'Error fetching product from API' } };
			}
		} else {
			const p = product.product;
			return {
				product_name: p.product_name,
				brands: p.brands,
				brands_tags: p.brands_tags,
				image_front_url: p.image_front_url,
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
