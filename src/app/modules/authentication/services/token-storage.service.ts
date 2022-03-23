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
    window.localStorage.clear();
  }
 
  public getToken(): string | null {
    if(localStorage.getItem('RememberMe')!== null){
      return window.localStorage.getItem(USER_KEY);
    }
    return window.sessionStorage.getItem(USER_KEY);
  }
  public saveUser(user: User,rememberMe?:boolean): void {
    if(rememberMe){
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      window.localStorage.setItem('RememberMe', JSON.stringify(rememberMe));
    }else{
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }
  public getUser(): any | {} {

    let user:any;

    if(localStorage.getItem('RememberMe')!== null){
      user = window.localStorage.getItem(USER_KEY);
    }else{
      user = window.sessionStorage.getItem(USER_KEY);
    }

    if (user) {return JSON.parse(user)}

    return null;
  }

  public get getUserRoles(): any | {} {

    let user = this.getUser();
    if(user) return user['roles'];

    return null;
  }

  public get isAdmin(): any | {} {

    let user = this.getUserRoles;
    if(user) return this.getUserRoles.includes('administrator');

    return null;
  }

  
}
