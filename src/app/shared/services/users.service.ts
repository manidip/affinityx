import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}

  getAll(options:any) {
    if(!options.page) options['page'] = 1;
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/users`,{ params: {...options},observe: "response" })
  }
  get(options:any) {
    let id = options.id;
    delete options['id'];
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/users/${id}`,{ params: {...options},observe: "response" })
  }

  delete(item) {
    return this.http.delete<any>(`${environment.apiUrl}/wp/v2/users/${item.id}`,{ params: {'reassign':1,'force':true}})
  }


  getRoles(options?:any){
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/users/roles`,{ params: {...options},observe: "response" })
  }

  insert(data:any){
    return this.http.post<any>(`${environment.apiUrl}/wp/v2/users/`,data);
  }
  update(data:any,id:Number | string){
    return this.http.post<any>(`${environment.apiUrl}/wp/v2/users/${id}`,data);
  }

  insert_or_update(data:any,id:Number | string){
    if(Number.isInteger(id)){
      return this.update(data,id)
    }else{
      return this.insert(data)
    }
  }

  is_username_exists(username){
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/users/exists/${username}`);
  }
  
}
