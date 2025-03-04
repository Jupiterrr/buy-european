import { useEffect, useState } from "react";
// import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_API_KEY!);

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

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   generationConfig: {
//     responseMimeType: "application/json",
//     responseSchema: {
//       type: SchemaType.OBJECT,
//       properties: {
//         company: {
//           type: SchemaType.OBJECT,
//           properties: {
//             name: {
//               type: SchemaType.STRING,
//               description: "Name of the company",
//               nullable: false,
//             },
//             country: {
//               type: SchemaType.STRING,
//               description: "Country of the company",
//               nullable: false,
//             },
//             isEu: {
//               type: SchemaType.BOOLEAN,
//               description: "Whether the company is located in the European Union",
//               nullable: false,
//             },
//           },
//           nullable: false,
//         },
//         parentCompany: {
//           type: SchemaType.OBJECT,
//           properties: {
//             name: {
//               type: SchemaType.STRING,
//               description: "Name of the company",
//               nullable: false,
//             },
//             country: {
//               type: SchemaType.STRING,
//               description: "Country of the company",
//               nullable: false,
//             },
//             isEu: {
//               type: SchemaType.BOOLEAN,
//               description: "Whether the company is located in the European Union",
//               nullable: false,
//             },
//           },
//           nullable: true,
//         },
//       },
//     },
//   },
// });

// async function getOriginWithGemini(brand: string) {
//   const prompt = `Provide information about the brand '${brand}' as JSON. Specifically, include:
//     1. The company's official name.
//     2. Whether the company is located in the European Union (true/false).
//     3. The company's headquarters location.
//     4. The parent company's official name (if applicable).
//     5. The parent company's headquarters location (if applicable).
//     6. Whether the parent company's headquarters is in the European Union (true/false).
// `;

//   const result = await model.generateContent(prompt);
//   const rawJson = result.response.text();
//   console.log("rawJson", rawJson);
//   const companyInfo: CompanyInfoResponse = JSON.parse(rawJson);
//   return companyInfo;
// }

async function getCompanyFromApi(brand: string) {
  const params = new URLSearchParams({
    name: brand,
  });
  const response = await fetch(
    `https://worker.carsten-487.workers.dev/company?${params.toString()}`
  );
  const { data, error } = await response.json();
  if (error) {
    throw new Error(`Error fetching company info: ${error}`);
  }
  return data;
}

export function useCompanyInfo(brand: string | null) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCompanyInfo() {
      if (!brand) {
        return;
      }

      setLoading(true);
      const info = await getCompanyFromApi(brand);
      console.log("info", info);
      if (info) {
        setCompanyInfo(info);
      }

      setLoading(false);
    }

    fetchCompanyInfo();
  }, [brand]);

  return { companyInfo, loading };
}
