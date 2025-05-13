export interface User {
  email: string;
  firstname: string;
  lastname: string;
  isActive: boolean;
  roles: 'ADMIN' | 'EDITOR' | 'READER'[];
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserLoggedIn {
  _id: string;
  email: string;
  roles: string[];
  exp: number;
}
