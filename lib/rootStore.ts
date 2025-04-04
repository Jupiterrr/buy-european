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
      const response = (await rq.json()) as ProductInfoResponse;

      if (this.currentLoadingCode !== code) {
        return;
      }

      if (response.error) {
        console.error("api error", response);
        setResult(null, response.error);
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
