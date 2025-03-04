import { Hono } from 'hono';
import { lookupCompany } from './company-lookup';

const app = new Hono<{ Bindings: Env }>();

const cacheVersion = 1;

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

	const companyInfo = await lookupCompany(c.env, name);
	await c.env.BUY_EUROPEAN_KV.put(`company:${name}:${cacheVersion}`, JSON.stringify(companyInfo));

	return c.json({ data: companyInfo });
});

export default app;
