import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Router , ActivatedRoute} from '@angular/router';
import { TokenStorageService } from './modules/authentication/services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor( private activeRoute:ActivatedRoute, private router: Router, private titleService: Title,private tokenStorageService: TokenStorageService) { 
    this.titleService.setTitle('Affinityx');
  }

  ngOnInit() {  
    
  }  
  
}
