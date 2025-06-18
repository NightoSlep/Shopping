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
    email: string
    phone: string
    address: string
    role: string;
  }

  export interface UpdatedUser {
    id: string
    email: string
    username: string
    phone: string
    address: string
  }

  export interface User {
    id: string
    email: string
    username: string
    password?: string
    phone: string
    address: string
    createdOn: string
    role: string
    isActive: boolean
  }