-- Migration number: 0004 	 2025-03-14T12:15:54.291Z
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  company_tag TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  country_code TEXT,
  parent_company_tag TEXT REFERENCES companies(company_tag),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  source TEXT NOT NULL
);

