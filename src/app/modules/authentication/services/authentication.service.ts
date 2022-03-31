import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
    ) {
}

  login(userDetails: {username:string;password:string,rememberMe:boolean}): Observable<any>{
    userDetails['custom_auth'] = 'is_active';
    return this.http.post<any>(`${environment.apiUrl}/jwt-auth/v1/token`, userDetails,httpOptions)
    .pipe(map(userResponse => {
        if(userResponse.success && userResponse.data.token) {
          this.tokenStorageService.saveUser(userResponse.data,userDetails?.rememberMe)
        }
        return userResponse;
    }));
  }

  validate(token): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/jwt-auth/v1/token/validate`, token, httpOptions)
    .pipe(map(userResponse => {
        if(userResponse.success && userResponse.data.token) {
          this.tokenStorageService.saveUser(userResponse.data)
        }
        return userResponse;
    }));
  }
  
  
}
