// llm generated types. yolo
interface ProductResponse {
  code: string;
  product: Product;
  status: string;
  result: {
    id: string;
    name: string;
    lc_name: string;
  };
}

interface Product {
  _id: string;
  code: string;
  product_name: string;
  brands: string;
  brands_tags: string[];
  categories: string;
  categories_tags: string[];
  ingredients: Ingredient[];
  ingredients_text: string;
  nutriments: {
    energy: number;
    "energy-kcal": number;
    fat: number;
    proteins: number;
    carbohydrates: number;
    sugars: number;
    [key: string]: number; // Allow other nutriment fields
  };
  nutrient_levels: {
    fat: string;
    "saturated-fat": string;
    sugars: string;
    [key: string]: string;
  };
  images: {
    [key: string]: {
      sizes: {
        [size: string]: {
          h: number;
          w: number;
        };
      };
      uploaded_t: number;
      uploader: string;
    };
  };
  labels_tags: string[];
  nova_group?: number;
  ecoscore_grade?: string;
  nutriscore_grade?: string;
}

interface Ingredient {
  id: string;
  text: string;
  percent_estimate?: number;
  percent_max?: number | string;
  percent_min?: number;
  vegan?: string;
  vegetarian?: string;
  ingredients?: Ingredient[]; // For nested ingredients
}

async function getProduct(code: string): Promise<ProductResponse> {
  // https://world.openfoodfacts.org/api/v3/product/737628064502.json
  const url = `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}.json`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.result.status === "failure") {
    throw new Error(data.result.name, { cause: data.result.code });
  }

  return data;
}

getProduct("4029764001906").then((it) => console.log(JSON.stringify(it, null, 2)));


// origins_of_ingredients
// "origins": "Duitsland",
// "origins_hierarchy": ["en:germany"],
// "origins_lc": "nl",
// "origins_tags": ["en:germany"],
// packaging_lc
// "product_name": "Club-Mate Zero",
// "product_name_de": "Chargement…",
// "product_name_en": "",
// "product_name_fr": "Club-Mate Zero",