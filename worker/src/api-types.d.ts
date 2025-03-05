interface CompanyInfo {
	company: {
		name: string;
		country: string;
		isEu: boolean;
	} | null;
	parentCompany: {
		name: string;
		country: string;
		isEu: boolean;
	} | null;
}

interface ProductInfo extends CompanyInfo {
	code: string;
	name: string;
	imageUrl?: string;
	companyOrigin: 'eu' | 'non-eu' | 'unknown';
}

type ProductInfoError = { error: { code: 'not_found' | 'invalid_request' | 'internal_error'; message: string }, data?: null };

type ProductInfoResponse = { data: ProductInfo, error?: null } | ProductInfoError;
