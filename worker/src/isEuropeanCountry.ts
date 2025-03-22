export function isEuropeanCountry(countryCode: string) {
	return [
		'AL',  // Albania
		'AD',  // Andorra
		'AT',  // Austria
		'BY',  // Belarus
		'BE',  // Belgium
		'BA',  // Bosnia and Herzegovina
		'BG',  // Bulgaria
		'HR',  // Croatia
		'CY',  // Cyprus
		'CZ',  // Czech Republic
		'DK',  // Denmark
		'EE',  // Estonia
		'FI',  // Finland
		'FR',  // France
		'DE',  // Germany
		'GR',  // Greece
		'HU',  // Hungary
		'IS',  // Iceland
		'IE',  // Ireland
		'IT',  // Italy
		'XK',  // Kosovo
		'LV',  // Latvia
		'LI',  // Liechtenstein
		'LT',  // Lithuania
		'LU',  // Luxembourg
		'MT',  // Malta
		'MD',  // Moldova
		'MC',  // Monaco
		'ME',  // Montenegro
		'NL',  // Netherlands
		'MK',  // North Macedonia
		'NO',  // Norway
		'PL',  // Poland
		'PT',  // Portugal
		'RO',  // Romania
		'RU',  // Russia
		'SM',  // San Marino
		'RS',  // Serbia
		'SK',  // Slovakia
		'SI',  // Slovenia
		'ES',  // Spain
		'SE',  // Sweden
		'CH',  // Switzerland
		'UA',  // Ukraine
		'GB',  // United Kingdom
		'VA',  // Vatican City
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
