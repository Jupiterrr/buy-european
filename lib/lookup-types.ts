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

export interface Product {
  [key: string]: any;
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
  image_front_url: string;
  image_front_small_url: string;
  image_front_thumb_url: string;
  image_front_display_url: string;
  image_front_small_display_url: string;

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
