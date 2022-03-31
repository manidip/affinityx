import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-logout',
  template: '',
  styleUrls: []
})
export class LogoutComponent implements OnInit {

  constructor( private router: Router,private tokenStorageService: TokenStorageService) {
    this.tokenStorageService.logout();
    this.router.navigate(['login']);
   }

  ngOnInit(): void {
  }

}
