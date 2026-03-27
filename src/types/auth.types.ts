export type UserRole = "renter" | "owner" | "admin";

export type ServiceCitySlug = "bangalore" | "mumbai" | "kolkata";

export interface UserPreferences {
  defaultCity?: ServiceCitySlug;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  preferences?: UserPreferences;
}
