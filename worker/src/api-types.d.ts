interface CompanyInfo {
	company: {
		name: string;
		country: string | null;
		countryCode: string | null;
	} | null;
	parentCompany: {
		name: string;
		country: string | null;
		countryCode: string | null;
	} | null;
}

interface ProductInfo extends CompanyInfo {
	code: string;
	name: string;
	imageUrl?: string;
	base64Image?: string;
	companyOrigin: 'eu' | 'non-eu' | 'unknown';
}

interface LocalProductCompany {
	name: string,
	countryCode: string,
}

interface LocalProductData {
	company: LocalProductCompany,
	parentCompany: LocalProductCompany,
	base64image:string,
}

interface LocalProduct {
 	ean: string;
	name: string,
	ip_address?: string ,
	data?: string,
}

interface ChangeRequest {
	ip_address?: string ,
	data?: string,
}

type ProductInfoError = { error: { code: 'not_found' | 'invalid_request' | 'internal_error'; message: string }, data?: null };

type ProductInfoResponse = { data: ProductInfo, error?: null } | ProductInfoError;
