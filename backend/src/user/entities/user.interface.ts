export interface IUser {
  id: string;
  email: string;
  username: string;
  password?: string; // Nếu không cần lưu password, có thể bỏ
  role: string;
}
