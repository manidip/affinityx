import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { TokenStorageService } from '../../services/token-storage.service';
import {SnotifyPosition,SnotifyService} from 'ng-snotify';
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
  returnUrl: string;  
  
  constructor(
    private fb: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private snotifyService: SnotifyService,
    ) {
      if (this.tokenStorageService.getUser()) {
        this.router.navigate(['/home']);
      }
    }
   
  ngOnInit(){

    this.loginForm = this.fb.group({
      username: ['affinityxlog',[Validators.required]],
      password: ['ob-7@3b#^1:_',[Validators.required]],
      rememberMe: [false]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get loginFormControls() { return this.loginForm.controls; }

  onSubmit() {
    
    this.submitted = true;
    if (this.loginForm.invalid) return;
    let toast = this.snotifyService.info('Logging you in', {...environment.toastConfig});
    this.authenticationService.login(this.loginForm?.value)
    .pipe(first())
    .subscribe({
      next: (response) => {
        //this.snotifyService.success('Logged in as ' + response.data.displayName, {...environment.toastConfig});
        this.submitted = false;
        toast.body = 'Logging you in as ' + response.data.displayName;
      
        setTimeout(() => {
          this.router.navigate([this.returnUrl]);
        }, 2000);
       
        },
      error: (err: Error) => {
        toast.config.type = 'error';
        toast.body = 'Invalid Credentials';
        this.submitted = false;
      },
    })
}

}
