import { useEffect, useState } from 'react';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

interface CompanyInfoResponse {
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

export async function lookupCompany(env: Env, brand: string) {
	const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

	const model = genAI.getGenerativeModel({
		model: 'gemini-1.5-flash',
		generationConfig: {
			responseMimeType: 'application/json',
			responseSchema: {
				type: SchemaType.OBJECT,
				properties: {
					company: {
						type: SchemaType.OBJECT,
						properties: {
							name: {
								type: SchemaType.STRING,
								description: 'Name of the company',
								nullable: false,
							},
							country: {
								type: SchemaType.STRING,
								description: 'Country of the company',
								nullable: false,
							},
							isEu: {
								type: SchemaType.BOOLEAN,
								description: 'Whether the company is located in the European Union',
								nullable: false,
							},
						},
						nullable: false,
					},
					parentCompany: {
						type: SchemaType.OBJECT,
						properties: {
							name: {
								type: SchemaType.STRING,
								description: 'Name of the company',
								nullable: false,
							},
							country: {
								type: SchemaType.STRING,
								description: 'Country of the company',
								nullable: false,
							},
							isEu: {
								type: SchemaType.BOOLEAN,
								description: 'Whether the company is located in the European Union',
								nullable: false,
							},
						},
						nullable: true,
					},
				},
			},
		},
	});

	const prompt = `Provide information about the brand '${brand}' as JSON. Specifically, include:
    1. The company's official name.
    2. Whether the company is located in the European Union (true/false).
    3. The company's headquarters location.
    4. The parent company's official name (if applicable).
    5. The parent company's headquarters location (if applicable).
    6. Whether the parent company's headquarters is in the European Union (true/false).
`;

	const result = await model.generateContent(prompt);
	const rawJson = result.response.text();
	console.log('rawJson', rawJson);
	const companyInfo: CompanyInfoResponse = JSON.parse(rawJson);
	return companyInfo;
}

