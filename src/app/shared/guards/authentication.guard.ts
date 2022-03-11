import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenStorageService } from '../../modules/authentication/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,private tokenStorageService: TokenStorageService) {}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
    return false;
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot,state: RouterStateSnapshot) {

      const currentUser = this.tokenStorageService.getUser();

      if(Object.keys(currentUser).length > 0)  return true; 
      
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
  }

}
