import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user';

const USER_KEY = 'authUser';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }
  
  logout(): void {
    window.sessionStorage.clear();
  }
 
  public getToken(): string | null {
    return window.sessionStorage.getItem(USER_KEY);
  }
  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any | {} {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  
}
