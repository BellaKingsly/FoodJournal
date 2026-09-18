/*
 * Date: 20/08/2026
 * Name:  Cole Zinda / Penglei Fan - Bella
 *
 * File Path: src/types/models.ts
 * Function: Defines the shared data contracts returned by the Food Journal API
 */

export type UserRole = "auth" | "customer" | "chef" | "courier";
export type ViewKind =
  | "home"
  | "list"
  | "detail"
  | "form"
  | "status"
  | "error"
  | "empty"
  | "map"
  | "settings"
  | "wallet"
  | "messages"
  | "cart"
  | "info";
export interface ViewDefinition {
  id: number;
  route: string;
  componentName: string;
  sharedComponent?: boolean;
  title: string;
  role: UserRole;
  group: string;
  kind: ViewKind;
}
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}
export interface CartItem {
  itemId: number;
  name: string;
  quantity: number;
  price: number;
}
export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}
export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  address: string;
  avatar: string;
}
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "customer";
  avatar?: string;
}
export interface AuthResponse {
  token: string;
  user: AuthUser;
}
export interface RegistrationResponse {
  message: string;
  user: AuthUser;
}
export interface Order {
  id: string;
  customerName: string;
  chefName: string;
  status: string;
  total: number;
  address: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}
