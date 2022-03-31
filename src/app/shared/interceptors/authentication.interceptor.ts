import { Injectable } from '@angular/core';
import {  HttpRequest,  HttpHandler, HttpEvent,  HttpInterceptor, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../../modules/authentication/services/token-storage.service';
import { environment } from 'src/environments/environment';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private tokenStorageService: TokenStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  
    const userDetails = this.tokenStorageService.getUser();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const d = new Date();

    if (userDetails && userDetails.token  && isApiUrl) {
      request = request.clone({ 
        headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + userDetails.token),
        params:(request.params ? request.params : new HttpParams())
        .set('time', d.getTime())
      });
    }
  

    return next.handle(request);
  }
}

