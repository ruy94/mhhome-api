export interface AuthenticatedAdmin {
  id: string;
  username: string;
  permissions: string[];
}

export interface AuthenticatedWebsiteUser {
  id: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  avatar: string | null;
}

export interface Dimensions {
  [key: string]: string; // VD: { "Color": "Red", "Material": "Silk" }
}

export interface TierVariation {
  name: string; // "Color"
  options: string[]; // ["Red", "Blue"]
}
