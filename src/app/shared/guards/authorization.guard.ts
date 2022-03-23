import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../../modules/authentication/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {
  
  constructor(private router: Router,private tokenStorageService: TokenStorageService) {}
  
    canActivateChild(childRoute: ActivatedRouteSnapshot,state: RouterStateSnapshot) {

      const currentuser = this.tokenStorageService.getUser();
      if(currentuser && !currentuser.isAdmin)
        this.router.navigate(['/unauthorized']);
    
      return true;
  }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {

      const currentuser = this.tokenStorageService.getUser();
      if(currentuser && !currentuser.isAdmin)
        this.router.navigate(['/unauthorized']);
    
      return true;
  }

}
