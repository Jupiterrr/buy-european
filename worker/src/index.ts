import { Hono } from 'hono';
import { lookupCompany } from './company-lookup';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
const app = new Hono<{ Bindings: Env }>();

const cacheVersion = 1;

app.get('/product', async (c) => {
	try {
		const code = c.req.query('code');

		if (!code) {
			return c.json({ error: { code: 'invalid_request', message: 'Code parameter is required' } }, 400);
		}

		const productInfo = await getProduct(code);

		if (productInfo.error) {
			return c.json(productInfo, 400);
		}

		const companyInfo = await getCompany(c.env, productInfo.brands);

		let companyOrigin: 'unknown' | 'eu' | 'non-eu' = 'unknown';
		if (companyInfo.company) {
			companyOrigin = companyInfo.company.isEu ? 'eu' : 'non-eu';
			if (companyInfo.parentCompany && companyInfo.parentCompany.isEu === false) {
				companyOrigin = 'non-eu';
			}
		}

		return c.json({
			data: {
				code: code,
				name: productInfo.product_name,
				imageUrl: productInfo.image_front_url,
				...companyInfo,
				companyOrigin,
			},
		} satisfies ProductInfoResponse);
	} catch (error) {
		console.error(error);
		return c.json({ error: { code: 'internal_error', message: 'Internal server error' } }, 500);
	}
});

export default app;

async function getProduct(code: string) {
	try {
		const url = `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}.json`;
		const response = await fetch(url, {
			headers: {
				'User-Agent': `Buy European - API`,
			},
		});
		const product = (await response.json()) as any;
		// const { country, origin } = getCountryFromEAN(code) || { country: null, origin: null };

		if (product.status === 'failure') {
			console.log('off rq error', product);
			if (product.result.id === 'product_not_found' || product.result.id === 'product_found_with_a_different_product_type') {
				return { error: { code: 'not_found', message: 'Product not found' } };
			} else {
				return { error: { code: 'internal_error', message: 'Error fetching product from OpenFoodFacts' } };
			}
		} else {
			const p = product.product;
			console.log('openfoodfacts product', p);
			return {
				product_name: p.product_name,
				brands: p.brands,
				brands_tags: p.brands_tags,
				image_front_url: p.image_front_url,
			};
		}
	} catch (error) {
		return { error: { code: 'internal_error', message: 'Error fetching product from OpenFoodFacts' } };
	}
}

async function getCompany(env: Env, name: string): Promise<CompanyInfo> {
	// Caching:
	const data = await env.BUY_EUROPEAN_KV.get(`company:${name}:${cacheVersion}`);
	if (data) {
		console.log(`Cache hit "${name}"`);
		return JSON.parse(data) as CompanyInfo;
	}

	console.log(`Cache miss "${name}"`);

	const companyInfo = await lookupCompany(env, name);
	await env.BUY_EUROPEAN_KV.put(`company:${name}:${cacheVersion}`, JSON.stringify(companyInfo));
	return companyInfo;
}
