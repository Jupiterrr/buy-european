import { useState } from "react";

export type Product = Exclude<ProductInfoResponse["data"], null | undefined>;
export type ApiError = Exclude<ProductInfoResponse["error"], null | undefined>;

export function useProductInfo(code: string) {
  const [currentCode, setCurrentCode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchProduct() {
    setProduct(null);
    setError(null);
    setLoading(true);

    // const API_BASE = "http://192.168.178.41:8787";
    const API_BASE = 'https://worker.carsten-487.workers.dev'
    try {
      console.log(
        "fetching product",
        `${API_BASE}/product?${new URLSearchParams({ code }).toString()}`
      );
      const rq = await fetch(`${API_BASE}/product?${new URLSearchParams({ code }).toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("rq", rq.url);
      const response = (await rq.json()) as ProductInfoResponse;
      if (response.error) {
        console.error("api error", response);
        setError(response.error);
      } else {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("catch error", error);
      setError({ code: "internal_error", message: "Error fetching product" });
    } finally {
      setLoading(false);
    }
  }

  if (currentCode !== code) {
    console.log("fetching product", code);
    setCurrentCode(code);
    fetchProduct();
  }

  console.log("useProductInfo", { product, error, loading });

  return { product, error, loading };
}
