import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private secretKey = 'my_secret_is_key';
  private tokenKey = 'token';
  private userId = 'userid';
  private roleKey = 'role';
  private username = 'username';
  private refreshKey = 'refresh_token';
  
  constructor() { }

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  private decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

  setToken(token: string): void {
    const encrypted = this.encrypt(token);
    localStorage.setItem(this.tokenKey, encrypted);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token ? this.decrypt(token) : null;
  }

  setRefreshToken(refresh_token: string): void {
    const encrypted = this.encrypt(refresh_token);
    localStorage.setItem(this.refreshKey, encrypted);
  }
  
  getRefreshToken(): string | null {
    const refresh_token = localStorage.getItem(this.refreshKey);
    return refresh_token ? this.decrypt(refresh_token) : null;
  }
  
  removeRefreshToken(): void {
    localStorage.removeItem('refresh_token');
  }
  
  setUserId(userId: string): void {
    const encryptedId = CryptoJS.AES.encrypt(userId, this.secretKey).toString();
    localStorage.setItem(this.userId, encryptedId);
  }

  getUserId(): string | null {
    const userId = localStorage.getItem(this.userId);
    return userId ? this.decrypt(userId) : null;
  }

  setRole(role: string): void {
    localStorage.setItem(this.roleKey, this.encrypt(role));
  }

  getRole(): string | null {
    const role = localStorage.getItem(this.roleKey);
    return role ? this.decrypt(role) : null;
  }

  clear(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userId);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.username);
    localStorage.removeItem(this.refreshKey);
  }
}
