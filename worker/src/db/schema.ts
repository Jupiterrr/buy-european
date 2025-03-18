import { aliasedTable } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { AnySQLiteColumn, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export function getDb(env: Env) {
	return drizzle(env.DB);
}

export const companyTable = sqliteTable('companies', {
	// open food fact company tag
	company_tag: text().primaryKey(),
	company_name: text().notNull(),
	country_code: text(),
	parent_company_tag: text().references((): AnySQLiteColumn => companyTable.company_tag),
	created_at: text()
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	source: text().$type<'off' | 'llm' | 'scraper' | 'manual'>().notNull(),
});


export const productsTable = sqliteTable('products', {
	// open food fact company tag
	ean: text().primaryKey(),
	name: text(),
	data: text(),
	company_tag: text(),
	company_name: text(),
	image_url: text(),
	source: text().$type<'app'>(),
	// maybe add ip if we have it
	created_at: text()
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	status: text().$type<'draft' | 'submitted' | 'accepted' | 'declined'>().notNull(),
});

export const newPoductTable = sqliteTable('new_product_requests', {
	// open food fact company tag
	ean: text().primaryKey(),
	name: text(),
	data: text(),
	ip_address: text(),
	created_at: text()
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	status: text().$type<'draft' | 'submitted' | 'accepted' | 'declined'>().notNull(),
});

export const changeRequestsTable = sqliteTable('change_requests', {
	// open food fact company tag
	data: text().notNull(),
	ip_address: text(),
	request_type: text().notNull(),
	created_at: text()
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	status: text().$type<'draft' | 'submitted' | 'accepted' | 'declined'>().notNull(),
});

export const parentCompanyTable = aliasedTable(companyTable, 'parent');
