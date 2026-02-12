import { makeAutoObservable, runInAction } from "mobx";

export type Product = Exclude<ProductInfoResponse["data"], null | undefined>;
export type ApiError = Exclude<ProductInfoResponse["error"], null | undefined>;

class RootStore {
  productStore: ProductStore;

  constructor() {
    makeAutoObservable(this);
    this.productStore = new ProductStore(this);
  }
}

class ProductStore {
  loading = false;
  error: ApiError | null = null;
  product: Product | null = null;
  currentLoadingCode: string | null = null;
  updated: boolean = false;

  // API_BASE = "http://192.168.178.41:8787";
  API_BASE = "https://worker.carsten-487.workers.dev";

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  private normalizeProductError(error: ApiError): ApiError {
    const message = String(error.message ?? "").toLowerCase();
    if (
      error.code === "internal_error" &&
      (
        message.includes("product info error") ||
        message.includes("error fetching product from api") ||
        message.includes("error in /product")
      )
    ) {
      return { code: "not_found", message: "Product not found" };
    }
    return error;
  }

  async makeChangeRequest(code: string, data: ChangeRequest) {
    try {
      this.updated = true;
      const response = await fetch(`${this.API_BASE}/change-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result:any = await response.json();

      await this.fetchProduct(code);
  
      if (!response.ok) {
        console.error('Error:', result.error);
        throw new Error(result.error.message);
      }
  
      console.log('Product saved successfully:', result);
    } catch (error) {
      console.error('Request failed:', error);
    }
    
  }

  async addProduct(product: LocalProduct) {
    try {
      this.updated = true;
      const response = await fetch(`${this.API_BASE}/new-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
  
      const data:any = await response.json();
  
      if (!response.ok) {
        console.error('Error:', data.error);
        throw new Error(data.error.message);
      }
  
      console.log('Product saved successfully:', data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  async fetchAlternatives(code: string) {
    
    try {
      const url = new URL(`${this.API_BASE}/get-alternatives`);
      url.searchParams.set("code", code);

      console.log("fetching alternatives", url.toString());
      const rq = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response:any = (await rq.json());

      console.log('response', response);

      if (response.error) {
        console.error("api error", response);
        return [];
      } else {
      

        return response;

        // TODO:
        // Cache the alternatives
        // Set the datatypes
      }
    } catch (error) {
      console.error("catch error", error);
      return [];
    }
  }

  async getConfirmations(code: string) {
    
    try {
      const url = new URL(`${this.API_BASE}/get-confirmations`);
      url.searchParams.set("code", code);

      const rq = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response:any = (await rq.json());

      if (response.error) {
        console.error("api error", response);
        return [];
      } 
  
      return response;
      
    } catch (error) {
      console.error("catch error", error);
      return [];
    }
  }
  
  async addConfirmations(code: string, ip:string) {
    
    try {
      const url = new URL(`${this.API_BASE}/add-confirmations`);
      url.searchParams.set("code", code);
      url.searchParams.set("ip",ip);

      const rq = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response:any = (await rq.json());

      if (response.error) {
        console.error("api error", response);
        return [];
      } 
  
      return response;
      
    } catch (error) {
      console.error("catch error", error);
      return [];
    }
  }
  
  async clearConfirmations(code: string) {
    
    try {
      const url = new URL(`${this.API_BASE}/clear-confirmations`);
      url.searchParams.set("code", code);

      const rq = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response:any = (await rq.json());

      if (response.error) {
        console.error("api error", response);
        return [];
      } 
  
      return response;
      
    } catch (error) {
      console.error("catch error", error);
      return [];
    }
  }

  async fetchCompany(name: string): Promise<CompanyInfo | null> {
    try {
      const COUNTRY_NAME_FALLBACKS: Record<string, string> = {
        GB: "United Kingdom",
        US: "United States",
        DE: "Germany",
        FR: "France",
        FI: "Finland",
        SE: "Sweden",
        NL: "Netherlands",
        BE: "Belgium",
        IT: "Italy",
        ES: "Spain",
        DK: "Denmark",
        NO: "Norway",
        CH: "Switzerland",
        IE: "Ireland",
        AT: "Austria",
        PL: "Poland",
      };

      const requestCompanyRow = async (companyName: string) => {
        const url = new URL(`${this.API_BASE}/company_request`);
        url.searchParams.set("name", companyName);

        const rq = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const rawResponse = await rq.text();
        let response: any;
        try {
          response = JSON.parse(rawResponse);
        } catch {
          console.error("company lookup returned non-JSON response", {
            status: rq.status,
            body: rawResponse.slice(0, 200),
          });
          return null;
        }

        if (!rq.ok || response.error) {
          console.error("company lookup error", response);
          return null;
        }

        return response.data ?? null;
      };

      const toCountryName = (code: string | null | undefined) => {
        if (!code) return null;
        const normalized = code.trim().toUpperCase();
        try {
          if (typeof Intl !== "undefined" && typeof (Intl as any).DisplayNames === "function") {
            const displayNames = new (Intl as any).DisplayNames(["en"], { type: "region" });
            const regionName = displayNames.of(normalized);
            if (regionName && regionName.toUpperCase() !== normalized) {
              return regionName;
            }
          }
        } catch {
          // Fall through to return raw code if region display fails.
        }
        return COUNTRY_NAME_FALLBACKS[normalized] ?? normalized;
      };

      const companyRow = await requestCompanyRow(name);
      if (!companyRow) {
        return null;
      }

      const parentTag = companyRow.parent_company_tag as string | null | undefined;
      const parentRow = parentTag ? await requestCompanyRow(parentTag) : null;

      return {
        company: {
          name: companyRow.company_name ?? null,
          countryCode: companyRow.country_code ?? null,
          country: toCountryName(companyRow.country_code),
        },
        parentCompany: parentRow
          ? {
              name: parentRow.company_name ?? null,
              countryCode: parentRow.country_code ?? null,
              country: toCountryName(parentRow.country_code),
            }
          : null,
      };
    } catch (error) {
      console.error("company lookup failed", error);
      return null;
    }
  }

  async getAlternativeProduct(code: string) {
    const url = new URL(`${this.API_BASE}/product`);
      url.searchParams.set("code", code);

      console.log("fetching product", url.toString());
      const rq = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = (await rq.json()) as ProductInfoResponse;
      return response;
  }

  async fetchProduct(code: string) {
    if (!this.updated && this.currentLoadingCode === code && this.error === null) {
      return;
    }

    this.error = null;
    this.product = null;
    this.loading = true;
    this.currentLoadingCode = code;

    const setResult = (data: Product | null, error: ApiError | null) => {
      if (this.currentLoadingCode !== code) {
        return;
      }

      runInAction(() => {
        this.product = data;
        this.error = error;
        this.loading = false;
        this.updated = false;
      });
    };

    try {
      const url = new URL(`${this.API_BASE}/product`);
      url.searchParams.set("code", code);

      console.log("fetching product", url.toString());
      const rq = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("rq", rq.url);
      const rawResponse = await rq.text();
      let response: ProductInfoResponse;
      try {
        response = JSON.parse(rawResponse) as ProductInfoResponse;
      } catch {
        if (rq.status === 404) {
          setResult(null, { code: "not_found", message: "Product not found" });
          return;
        }
        throw new Error(`Invalid /product response: ${rawResponse.slice(0, 200)}`);
      }

      if (this.currentLoadingCode !== code) {
        return;
      }

      if (response.error) {
        const normalizedError = this.normalizeProductError(response.error);
        if (normalizedError.code === "not_found") {
          console.log("product not found", code);
        } else {
          console.error("api error", response);
        }
        setResult(null, normalizedError);
      } else {
        setResult(response.data, null);
      }
    } catch (error) {
      console.error("catch error", error);
      setResult(null, { code: "internal_error", message: "Error fetching product" });
    }
  }
}

export const rootStore = new RootStore();
