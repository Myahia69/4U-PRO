export interface Product {
  id: string;
  name: string;
  category: 'computer' | 'phone' | 'accessory';
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  specs: { label: string; value: string }[];
  colors: { name: string; hex: string; previewColor: string }[];
  rating: number;
  reviewsCount: number;
  features: string[];
  currency?: 'USD' | 'EGP';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
  platform: string;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  quantity: number;
  customSpec?: string;
}

export interface Order {
  id: string; // e.g. TX-XXXXX
  invoiceNumber?: string; // e.g. INV-1001 for sequential reference
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  date: string;
  items: CartItem[];
  totalPrice: number | string;
  status: 'pending' | 'paid' | 'delivered';
  currency: string;
}
