import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../modules/authentication/services/token-storage.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 
  currentUser: User | any;
  
  constructor(private router: Router,private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    if(this.tokenStorageService.getUser()){
      this.currentUser = this.tokenStorageService.getUser()
    }
  }

  logout(): void {
    this.tokenStorageService.logout();
    //this.router.navigate(['/login']);
}

}
