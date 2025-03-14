-- Migration number: 0003 	 2025-03-14T01:30:00.145Z
CREATE TABLE IF NOT EXISTS products (
	ean TEXT PRIMARY KEY,
	name TEXT,
	data TEXT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	status TEXT NOT NULL,
	source TEXT NOT NULL,
	company_tag TEXT NOT NULL,
	company_name TEXT NOT NULL,
	image_url TEXT
);
