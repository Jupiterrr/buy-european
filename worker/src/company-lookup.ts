import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { changeRequestsTable, companyTable, parentCompanyTable } from './db/schema';
import { eq, inArray, or } from 'drizzle-orm';
import { getDb } from './db/schema';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { europeanCountries } from './isEuropeanCountry';

export interface CompanyInfoV2 {
  company: {
    name: string;
    isoCountryCode: string | null;
  };
  parentCompany: {
    name: string;
    isoCountryCode: string | null;
  } | null;
}

export async function detectAbusiveText(env: Env, text: string) {
  try {
    const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            abusive: {
              type: SchemaType.BOOLEAN,
              description: 'Does the given text contain abusive words?',
              nullable: false,
            },
          },
        },
      },
    });

    const prompt = `You are an expert in detecting abusive text. A user added this text in the app.
    Please provide, if this text has any abusive content and the brand text sounds like a valid brand. Return a json with true or false.
    Text: "${text}"
  `;

    const result = await model.generateContent(prompt);
    const rawJson = result.response.text();
    console.log('detectAbusiveText [gemini]', rawJson);
    const jsonData = JSON.parse(result.response.text());

    return jsonData;
  } catch(e) {
    return e;
  }
}


export async function detectValidCompany(env: Env, text: string) {
  try {
    const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            valid: {
              type: SchemaType.BOOLEAN,
              description: 'Is it a valid company name',
              nullable: false,
            },
          },
        },
      },
    });

    const prompt = `You are an expert in company names. A user added this text in the app.
    Please provide, if the name could be a valid company name.
    Company name: "${text}"
  `;

    const result = await model.generateContent(prompt);
    const rawJson = result.response.text();
    const jsonData = JSON.parse(result.response.text());

    return jsonData;
  } catch(e) {
    return e;
  }
}

export async function lookupCompanyGemini(env: Env, brand: string) {
  const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          company: {
            type: SchemaType.OBJECT,
            properties: {
              name: {
                type: SchemaType.STRING,
                description: 'Name of the company or brand without corporate suffix or entity type',
                nullable: false,
              },
              country: {
                type: SchemaType.STRING,
                description: 'Country of the company',
                nullable: true,
              },
              isoCountryCode: {
                type: SchemaType.STRING,
                description: 'ISO country code of where the company is headquartered',
                nullable: true,
              },
            },
            nullable: false,
          },
          parentCompany: {
            type: SchemaType.OBJECT,
            properties: {
              name: {
                type: SchemaType.STRING,
                description: 'Name of the parent company without corporate suffix or entity type',
                nullable: false,
              },
              country: {
                type: SchemaType.STRING,
                description: 'Country of the parent company',
                nullable: true,
              },
              isoCountryCode: {
                type: SchemaType.STRING,
                description: 'ISO country code of where the parent company is headquartered',
                nullable: true,
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
    2. Country where the company is headquartered.
    3. The parent company's official name (if applicable).
    4. Country where the parent company is headquartered (if applicable).
`;

  const result = await model.generateContent(prompt);
  const rawJson = result.response.text();
  console.log('lookupCompany response [gemini]', rawJson);
  const companyInfo = JSON.parse(rawJson) as CompanyInfoV2;
  return companyInfo;
}

async function lookupCompanyOpenAi(env: Env, brand: string) {
  const openai = createOpenAI({
    // custom settings, e.g.
    // compatibility: 'strict', // strict mode, enable when using the OpenAI API
    apiKey: env.OPENAI_API_KEY,
  });
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      company: z.object({
        name: z.string().describe('Name of the brand or the company without corporate suffix or entity type'),
        // country: z.string().describe('Country of the company'),
        isoCountryCode: z.string().describe('ISO country code of where the company is headquartered'),
      }),
      parentCompany: z.object({
        name: z.string().describe('Name of the parent company without corporate suffix or entity type'),
        // country: z.string().describe('Country of the parent company'),
        isoCountryCode: z.string().describe('ISO country code of where the parent company is headquartered'),
      }),
    }),
    prompt: `Provide information about the brand '${brand}' as JSON. Specifically, include:
    1. The company's official name.
    2. Country where the company is headquartered.
    3. The parent company's official name (if applicable).
    4. Country where the parent company is headquartered (if applicable).`,
  });

  const companyInfo = object;
  console.log('lookupCompany response [openai]', companyInfo);
  return companyInfo;
}

export async function getCompanyEntry(env: Env, { name, tag }: { name: string; tag: string }) {
  let company = await getDb(env).select().from(companyTable).where(eq(companyTable.company_tag, tag)).get();
  if (company == null) {
    company = await getDb(env).select().from(companyTable).where(eq(companyTable.company_name, tag)).get();
  }
  
  return company;
}

export async function updateCountryCode(
  env: Env,
  { tag, countryCode, parentCompany }: { tag: string; countryCode: string | null, parentCompany:string | null }
) {

  try {
    let data:any = {};
    if (countryCode != null && countryCode != '') {
      data['country_code'] = countryCode;
    }
    if (parentCompany != null && parentCompany != '') {
      data['parent_company_tag'] = parentCompany;

      // Check if parent company exists
      const parentCompanyEntry = await getCompanyEntry(env, {name: parentCompany, tag: parentCompany});
      if (!parentCompanyEntry) {
        // it needs to be created
        const parentCompanyData = await lookupCompanyOpenAi(env, parentCompany);
        if (parentCompanyData.company) {
          await upsertCompany(env, {
            name: parentCompany,
            tag: parentCompany,
            isoCountryCode: parentCompanyData.company.isoCountryCode,
            parentCompanyTag: undefined,
          });
        }
      }
    }
    data['source'] = 'manual';

    const db = getDb(env);
    const result = await db
      .update(companyTable)
      .set(data)
      .where(
        or(
          eq(companyTable.company_tag, tag),
          eq(companyTable.company_name, tag)
        ));

    return result;
  } catch(e) {
    return 'Error: ' + e;
  }
}

export async function getAllEuropeanCompanies(env: Env) {
  const db = getDb(env);

  const companies = await db
    .select({
      name: companyTable.company_name,
      isoCountryCode: companyTable.country_code,
    })
    .from(companyTable)
    .where(inArray(companyTable.country_code, europeanCountries));

  return companies.map((company) => company.name);
}

export async function lookupCompanyV2(env: Env, { name, tag }: { name: string; tag: string }): Promise<CompanyInfoV2> {
  // 1. Lookup company info from db 
  const company = await getDb(env).select().from(companyTable).where(eq(companyTable.company_tag, tag)).get();
  const parentCompany = company?.parent_company_tag
    ? await getDb(env).select().from(parentCompanyTable).where(eq(parentCompanyTable.company_tag, company.parent_company_tag)).get()
    : null;

  console.log('lookupCompanyV2 cach result', { company: !!company, parentCompany: !!parentCompany });


  if (company) {
    return {
      company: {
        name: company.company_name,
        isoCountryCode: company.country_code,
      },
      parentCompany: parentCompany
        ? {
            name: parentCompany?.company_name,
            isoCountryCode: parentCompany?.country_code,
          }
        : null,
    };
  }

  // 2. Lookup company info from LLM
  // const companyInfo = await lookupCompanyGemini(env, name);
  const companyInfo = await lookupCompanyOpenAi(env, name);

  // 3.a Save parent company info to db
  let parentCompanyTag: string | undefined;
  if (companyInfo?.parentCompany) {
    parentCompanyTag = toCompanyTag(companyInfo.parentCompany.name);
    await upsertCompany(env, {
      name: companyInfo.parentCompany.name,
      tag: parentCompanyTag,
      isoCountryCode: companyInfo.parentCompany.isoCountryCode,
    });
  }

  // 3.b Save company info to db
  if (companyInfo.company) {
    await upsertCompany(env, {
      name: name,
      tag: tag,
      isoCountryCode: companyInfo.company.isoCountryCode,
      parentCompanyTag: parentCompanyTag ?? undefined,
    });
  }

  return companyInfo;
}

async function upsertCompany(env: Env, companyInfo: { name: string; tag: string; isoCountryCode: string | null; parentCompanyTag?: string }) {
  await getDb(env)
    .insert(companyTable)
    .values({
      company_tag: companyInfo.tag,
      company_name: companyInfo.name,
      country_code: companyInfo.isoCountryCode,
      parent_company_tag: companyInfo.parentCompanyTag,
      source: 'llm',
    })
    .onConflictDoNothing();
}

function toCompanyTag(name: string) {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .toLowerCase();
}
