export type BilingualText = Record<string, string> & {
  en: string;
  ar: string;
};

export type BilingualList = Record<string, string[]> & {
  en: string[];
  ar: string[];
};


export type Product = {
  id: string;
  name: BilingualText;
  slug: string;
  description: BilingualText;
  price: number;
  salePrice?: number;
  imageUrl: string;
  imageHint: string;
  category: string; // This will be the English name, used as a key
  ingredients: BilingualList;
  application: BilingualText;
  benefits: BilingualList;
  type: 'b2b' | 'b2c' | 'rd';
  is_visible?: boolean;
  is_featured?: boolean;
  activePromotion?: any;
};

export type Category = {
  id: string;
  name: BilingualText;
  slug: string;
  type: 'b2b' | 'b2c';
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
};
