export type Category = 'Skin Care' | 'Sun Care' | 'Hair Care' | 'Eye & Lash';

export type SkinType =
  | 'Normal'
  | 'Dry'
  | 'Oily'
  | 'Combination'
  | 'Sensitive'
  | 'Acne-Prone'
  | 'Mature'
  | 'All Skin Types';

export interface Product {
  id: string;
  brand: string;
  title: string;
  size: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: Category;
  skinTypes: SkinType[];
  image: string;
  fallbackImage: string;
  badge?: string;
  isBestSeller: boolean;
  description: string;
}

export interface BrandInfo {
  name: string;
  tagline: string;
  specialty: string;
  accentBg: string;
}

export interface CatalogData {
  brands: BrandInfo[];
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PriceRange = 'all' | 'under-50' | '50-100' | '100-200' | 'over-200';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';

export interface FilterState {
  categories: Category[];
  brands: string[];
  skinTypes: SkinType[];
  priceRange: PriceRange;
  bestSellersOnly: boolean;
}

export type ActiveView = 'home' | 'shop' | 'cart';

export type AuthProviderType = 'local' | 'google';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderType;
  avatar?: string;
  createdAt: string;
}

export interface StoredUser extends AuthUser {
  passwordHash?: string;
}

