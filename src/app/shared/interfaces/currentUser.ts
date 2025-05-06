export interface CurrentUser {
  authProvider: 'local' | 'google';
  avatar: string;
  createdAt: string;
  email: string;
  firstname: string;
  isActive: boolean;
  lastname: string;
  phone: { type: string; number: string }[];
  roles: 'ADMIN' | 'EDITOR' | 'READER'[];
  updatedAt: string;
  __v: number;
  _id: string;
  products: { product: string; cost: number; quantity: number; _id: string }[];
}

export interface GetCurrentUserResponse {
  status: string;
  data: CurrentUser;
}
