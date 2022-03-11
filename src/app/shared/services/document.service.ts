import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) {}

  getAll(options:any) {
    if(!options.page){
      options['page'] = 1;
    }
  
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/documents`,{ params: {...options},observe: "response" })
  }

  getById(id: number) {
      return this.http.get<any>(`${environment.apiUrl}/wp/v2/documents/${id}`);
  }

}
