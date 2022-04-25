import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from 'src/app/modules/authentication/services/token-storage.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  layout;
  currentUser;
  searchForm;

  constructor( 
    private tokenStorageService: TokenStorageService,
    private userService: UsersService,
    private spinner: NgxSpinnerService,
    private fb:FormBuilder,
    private router: Router
    ) { 
      this.currentUser = this.tokenStorageService.getUser();
      this.searchForm = this.fb.group({
        search: ['', [Validators.required]]
      })
    }

  ngOnInit(): void {
    
    this.spinner.show();
    this.userService.getDashboard(this.currentUser.id).subscribe(dashboard => {
      this.layout = dashboard.body;
      this.spinner.hide();
    })

    // this.searchForm.valueChanges.subscribe({
    //   next: data => {
    //     if (this.searchForm.valid) {
    //        console.log(this.searchForm);
    //     }
    //   },
    // });


  }

  onSearchSubmit(){
    this.router.navigate(['/user/documents/all'],{ queryParams: this.searchForm.value });
  }
}
