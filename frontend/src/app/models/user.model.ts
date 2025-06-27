export interface Login {
    username: string
    password: string
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export interface Register {
    username: string
    password: string
    accountName: string
    email: string
    phone: string
    address: string
    role: string;
  }

export interface UpdatedUser {
  accountName: string
  phone: string
  address: string
}

export interface User {
  id: string
  email: string
  accountName: string
  username: string
  password?: string
  phone: string
  address: string
  role: string
  isActive?: boolean
}

export interface ManageUser {
  id: string
  email: string
  accountName: string
  phone: string
  address: string
  role: string
  isActive: boolean
}