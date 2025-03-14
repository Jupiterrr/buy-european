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

export const parentCompanyTable = aliasedTable(companyTable, 'parent');
