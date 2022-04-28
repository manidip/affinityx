import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from 'src/app/modules/authentication/services/token-storage.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  layout: any;
  currentUser: any;
  searchForm: FormGroup;

  constructor( 
    private tokenStorageService: TokenStorageService,
    private userService: UsersService,
    private spinner: NgxSpinnerService,
    private fb:FormBuilder,
    private router: Router,
    private snotifyService: SnotifyService,
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
    if(this.searchForm['controls']['search'].value.length < 3){
      this.snotifyService.info("Please enter at least 3 characters", {...environment.toastConfig,timeout:1500});
      return;
    }
    this.router.navigate(['/user/documents/all'],{ queryParams: this.searchForm.value });
  }
}
