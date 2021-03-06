import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, TokenStorageService } from '../../services/';
import {SnotifyService} from 'ng-snotify';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string | undefined;  
  
  constructor(
    private fb: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private snotifyService: SnotifyService,
    ) {
      if (this.tokenStorageService.getUser())  this.router.navigate(['/']);
    
      this.loginForm = this.fb.group({
        username: ['',[Validators.required]],
        password: ['',[Validators.required]],
        rememberMe: [false]
      }); 
    }
   
  ngOnInit(){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get loginFormControls() { return this.loginForm.controls; }

  onSubmit() {

    this.submitted = true;
    if (this.loginForm.invalid) return;
    let toast = this.snotifyService.info('Logging you in', {...environment.toastConfig,timeout:2000});
    this.authenticationService.login(this.loginForm?.value)
    .pipe(first())
    .subscribe({
      next: (response:any) => {
        this.submitted = false;
        toast.body = 'Logging you in as ' + response.data.displayName;
        setTimeout(() => { this.router.navigate([this.returnUrl]);}, 2000);
      },
      error: (err: any) => {
        toast.config.type = 'error';
        toast.body = (err.code == 'not_activated') ? err.message : 'Invalid Credentials'; 
        this.submitted = false;
      },
    })
}

}
