import * as fs from 'fs';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import Papa from "papaparse";
import * as path from "path";

// Define the type for each row in the CSV
interface BrandData {
    brands_tag: string;
    brands: string;
    sample_codes: string;
    count: number;
    row_number: number;
    origin?: string; 
    origin_is_eu?: boolean;
    brand_name?: string;
    parent_company_origin?: string;
    parent_company_origin_is_eu?: boolean;
    parent_company_name?: string;
    website?: string;
}

// Hilfsfunktion für Promisify `csv-parse`
function parseCsvAsync(csvData: string): Promise<BrandData[]> {
    return new Promise((resolve, reject) => {
        parse(csvData, { columns: true, trim: true }, (err, records: BrandData[]) => {
            if (err) reject(err);
            else resolve(records);
        });
    });
}

async function fetchOrigin(company: string) {
    try {
        const params = new URLSearchParams({ name: encodeURIComponent(company) });
        console.log('params', params);
        const response = await fetch(`http://localhost:8787/company?${params.toString()}`);
        const { data, error } = await response.json();
        console.log('data', data);

        if (error) {
            console.error(`API Error for ${company}:`, error);
            return null;
        }
        return data;
    } catch (err) {
        console.error(`Fetch failed for ${company}:`, err);
        return null;
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to process the CSV and fetch missing data
async function main() {
    console.log("Start script");

    // File paths
    const filePath = 'off_data/brands.csv';
    const outputCsvPath = 'off_data/brands_companies_v2.csv';

    try {
        // Read the CSV data
        const csvData = fs.readFileSync(filePath, 'utf8');

        // Parse CSV asynchronously
        const records: BrandData[] = await parseCsvAsync(csvData);

        // Create a writable stream to write data as it is processed
        const outputStream = fs.createWriteStream(outputCsvPath, { encoding: 'utf8' });

        // Create a CSV stringifier that writes row-by-row
        const csvStringifier = stringify({ header: true, columns: [
            'brands_tag',
            'brands',
            'sample_codes',
            'count',
            'row_number',
            'origin',
            'origin_is_eu',
            'brand_name',
            'parent_company_origin',
            'parent_company_origin_is_eu',
            'parent_company_name',
            'website'
        ]});

        // Pipe the CSV stringifier into the output file
        csvStringifier.pipe(outputStream);

        // Process each record sequentially and write each line immediately
        for (let row of records) {
            await delay(5000); // 3-second delay before each API call
            const details = await fetchOrigin(row.brands);

            row.origin = details?.company?.country || null;
            row.origin_is_eu = details?.company?.isEu ?? null;
            row.brand_name = details?.company?.name || null;
            row.parent_company_origin = details?.parentCompany?.country || null;
            row.parent_company_origin_is_eu = details?.parentCompany?.isEu ?? null;
            row.parent_company_name = details?.parentCompany?.name || null;
            row.website = details?.company.website || null;

            // Write the updated row to the CSV file immediately
            csvStringifier.write(row);
        }

        // End the CSV stream when all records are processed
        csvStringifier.end();

        console.log("Data written successfully.");
    } catch (err) {
        console.error('Error processing files:', err);
    }
}


// Function to process CSV and update missing values
async function updateMissingValues() {
    const filePath = 'off_data/shorten_test_brands_companies.csv';
    const updatedFilePath = 'off_data/shorten_test_brands_companies_updated.csv';

    try {
        // Read the CSV file
        const csvData = fs.readFileSync(filePath, 'utf8');

        // Parse CSV into an array of objects
        parse(csvData, { columns: true, trim: true }, async (err, records) => {
            if (err) {
                console.error('Error parsing CSV:', err);
                return;
            }

            let updatedRecords = [];

            for (let row of records) {
                // Check if any of the key fields are missing (null)
                console.log('row.origin', row.origin);
                if (!row.origin) {
                    console.log(`Fetching missing data for: ${row.brands}`);
                    await delay(3000); // 1-second delay to prevent API rate limits
                    
                    const details = await fetchOrigin(row.brands);

                    if (details) {
                        row.origin = details?.company?.country || row.origin;
                        row.origin_is_eu = details?.company?.isEu ?? row.origin_is_eu;
                        row.brand_name = details?.company?.name || row.brand_name;
                        row.parent_company_origin = details?.parentCompany?.country || row.parent_company_origin;
                        row.parent_company_origin_is_eu = details?.parentCompany?.isEu ?? row.parent_company_origin_is_eu;
                        row.parent_company_name = details?.parentCompany?.name || row.parent_company_name;
                    }
                }

                updatedRecords.push(row);
            }

            // Convert updated records back to CSV
            stringify(updatedRecords, { header: true }, (err:any, output:any) => {
                if (err) {
                    console.error('Error writing CSV:', err);
                    return;
                }
                fs.writeFileSync(updatedFilePath, output, 'utf8');
                console.log('Updated CSV saved successfully!');
            });
        });

    } catch (err) {
        console.error('Error reading file:', err);
    }
}

interface CsvRow {
    brands_tag:any,
    brands:any,
    sample_codes:any,
    count:any,
    row_number:any,
    origin:any,
    origin_is_eu:any,
    brand_name:any,
    parent_company_origin:any,
    parent_company_origin_is_eu:any,
    parent_company_name:any,
    website:any
  }
  
  interface ValidationResult {
    isValid: boolean;
    invalidRows: { line: number; row: CsvRow; errors: string[] }[];
  }
  
  /**
   * Reads and validates a CSV file.
   * @param filePath - The path to the CSV file.
   * @param expectedHeaders - The expected column headers.
   * @returns Promise<ValidationResult> - Whether the file is valid or not, and a list of invalid rows.
   */
  const validateCsvFile = async (filePath: string, expectedHeaders: string[]): Promise<ValidationResult> => {
    return new Promise((resolve) => {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error("❌ File not found:", filePath);
        return resolve({ isValid: false, invalidRows: [] });
      }
  
      try {
        // Read the file as a string
        const fileContent = fs.readFileSync(filePath, "utf8").trim(); // Trim to remove unwanted newlines
  
        // Debug: Log raw CSV content
        // console.log("🔍 Raw CSV Content:\n", fileContent);
  
        // Parse CSV
        const result = Papa.parse<CsvRow>(fileContent, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true // Auto-converts numbers
        });
  
        // Debug: Show parsed data
        // console.log("📊 Parsed CSV Data:", result.data);
  
        // Check for parsing errors
        // if (result.errors.length > 0) {
        //   console.error("❌ CSV Parsing Errors:", result.errors);
        //   return resolve({ isValid: false, invalidRows: [] });
        // }

        // return;
  
        const data: CsvRow[] = result.data;
        const invalidRows: { line: number; row: CsvRow; errors: string[] }[] = [];
  
        // Validate Headers
        const actualHeaders = Object.keys(data[0] || {}).map(h => h.trim()); // Trim headers
        console.log("✅ Expected Headers:", expectedHeaders);
        console.log("✅ Actual Headers:", actualHeaders);
  
        if (!expectedHeaders.every(header => actualHeaders.includes(header))) {
          console.error("❌ Invalid CSV Headers:", actualHeaders);
          return resolve({ isValid: false, invalidRows: [] });
        }
  
        // Validate Data Rows
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const errors: string[] = [];

          //console.log("row", row.brand_name, row.website);

          const rowKeys = Object.keys(row);
    
            // Check if row has the correct number of columns
            if (rowKeys.length !== expectedHeaders.length) {
                console.log(`Incorrect number of columns (expected ${row.brands} ${row.brand_name} ${expectedHeaders.length}, found ${rowKeys.length})`);
            }

  
        //   if (typeof row.id !== "number" || isNaN(row.id)) {
        //     errors.push("Invalid ID (not a number)");
        //   }
        //   if (typeof row.name !== "string" || row.name.trim() === "") {
        //     errors.push("Invalid Name (empty or not a string)");
        //   }
        //   if (typeof row.email !== "string" || !row.email.includes("@")) {
        //     errors.push("Invalid Email (must contain @)");
        //   }
  
          if (errors.length > 0) {
            invalidRows.push({ line: i + 2, row, errors }); // +2 accounts for header row
          }
        }
  
        // Debug: Log found errors
        console.log("🔍 Invalid Rows Found:", invalidRows);
  
        resolve({
          isValid: invalidRows.length === 0,
          invalidRows
        });
  
      } catch (error) {
        console.error("❌ Error reading file:", error);
        resolve({ isValid: false, invalidRows: [] });
      }
    });
  };
  
  // Define CSV file path
  const filePath = path.join(__dirname, "../off_data/brands_companies_v2.csv");
  const expectedHeaders = ["brands_tag","brands","sample_codes","count","row_number","origin","origin_is_eu","brand_name","parent_company_origin","parent_company_origin_is_eu","parent_company_name","website"];
  
  // Run validation and log errors
  validateCsvFile(filePath, expectedHeaders).then((result) => {
    console.log("✅ CSV Validation Result:", result.isValid);
    if (!result.isValid) {
      console.log("❌ Invalid Rows:", JSON.stringify(result.invalidRows, null, 2));
    }
  });
// Run the function
//main();