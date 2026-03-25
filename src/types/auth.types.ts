export type UserRole = "renter" | "owner" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}
