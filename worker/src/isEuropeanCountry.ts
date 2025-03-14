export function isEuropeanCountry(countryCode: string) {
	return [
		'DE',
		'FR',
		'GB',
		'IT',
		'ES',
		'NL',
		'BE',
		'PL',
		'CZ',
		'RO',
		'BG',
		'SE',
		'GR',
		'PT',
		'HU',
		'AT',
		'DK',
		'FI',
		'IE',
		'SK',
		'SI',
		'LT',
		'LV',
		'EE',
		'CY',
		'MT',
		'GB',
		'GB-ENG',
		'GB-NIR',
		'GB-SCT',
		'GB-WLS',
	].includes(countryCode);
}

export type CompanyOrigin = 'eu' | 'non-eu' | 'unknown';

export function getCompanyOrigin(companyCountryCode: string | null | undefined, parentCompanyCountryCode: string | null | undefined): CompanyOrigin {
	if (!companyCountryCode) {
		return 'unknown';
	}

	if (parentCompanyCountryCode) {
		return isEuropeanCountry(companyCountryCode) && isEuropeanCountry(parentCompanyCountryCode) ? 'eu' : 'non-eu';
	} else {
		return isEuropeanCountry(companyCountryCode) ? 'eu' : 'non-eu';
	}
}
