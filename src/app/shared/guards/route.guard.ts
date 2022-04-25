import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../../modules/authentication/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  
  constructor(private router: Router,private tokenStorageService: TokenStorageService) {}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {


    
      const currentuser = this.tokenStorageService.getUser();
      if(currentuser){
        if(currentuser.isAdmin){
          this.router.navigate(['admin/dashboard'])
        }else{
          this.router.navigate(['user/dashboard'])
        }
      }else{
        this.router.navigate(['login'])
      }

      
  
      return false;
  }

}
