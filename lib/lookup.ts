import { useEffect, useState } from "react";
import { Product } from "./lookup-types";

type LookupError = { type: "not-found" | "error" | "invalid-code" };
type LookupResponse = { error: LookupError } | { product: Product; error: null };

class LookupService {
  async getProduct(code: string): Promise<LookupResponse> {
    if (!code) {
      return { error: { type: "invalid-code" } };
    }

    try {
      const url = `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}.json`;
      const response = await fetch(url);
      const product = await response.json();
      // const { country, origin } = getCountryFromEAN(code) || { country: null, origin: null };

      // console.log("res product", product);

      if (product.status === "failure") {
        if (product.result.id === "product_not_found") {
          return { error: { type: "not-found" } };
        } else {
          return { error: { type: "error" } };
        }
      } else {
        return { product: product.product, error: null };
      }
    } catch (error) {
      return { error: { type: "error" } };
    }
  }
}

export const lookupService = new LookupService();

export function useProductInfo(code: string) {
  const [currentCode, setCurrentCode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<LookupError | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchProduct() {
    setProduct(null);
    setError(null);
    setLoading(true);

    const response = await lookupService.getProduct(code);
    if (response.error) {
      setError(response.error);
    } else {
      setProduct(response.product);
    }
    setLoading(false);
  }

  if (currentCode !== code) {
    console.log("fetching product", code);
    setCurrentCode(code);
    fetchProduct();
  }

  return { product, error, loading };
}
