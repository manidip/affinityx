import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../../modules/authentication/services';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,private tokenStorageService: TokenStorageService) {}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
    const currentUser = this.tokenStorageService.getUser();
    console.log(currentUser);
    if(currentUser)  return true; 
    this.tokenStorageService.logout();
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
      const currentUser = this.tokenStorageService.getUser();
      if(currentUser)  return true; 
      this.tokenStorageService.logout();
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
      return false;
  }

}
