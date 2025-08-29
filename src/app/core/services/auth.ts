import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly STORAGE_KEY = 'mc_users';
  private readonly SESSION_KEY = 'mc_session';

  private get users(): Array<{name: string; email: string; password: string}> {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      { name: 'Administrador', email: 'admin@metrocuadrado.com', password: 'admin123' },
    ];
  }

  private set users(value: Array<{name: string; email: string; password: string}>) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
  }

  async login(email: string, password: string): Promise<boolean> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }));
      return true;
    }
    return false;
  }

  async register(data: any): Promise<boolean> {
    const exists = this.users.some(u => u.email === data.email);
    if (exists) return false;
    this.users = [...this.users, { name: data.name, email: data.email, password: data.password }];
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.SESSION_KEY);
  }
}
