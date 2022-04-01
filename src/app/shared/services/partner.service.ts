import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  public perPage = environment.defaultPerPage;

  constructor(private http: HttpClient) {}

  getAll(options?:any) {
    if(!options.page)  options['page'] = 1;
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/partners`,{ params: {...options},observe: "response" })
  }

  getById(options?:any) {
    let id = options.id;
    delete options['id'];
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/partners/${id}`,{observe: "response" });
  }
  getBySlug(options:any) {
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/partners/`,{ params: {...options},observe: "response" });
  }
  
  getBy(options?:any) {
    let post = options['post'];
    delete options['post'];
    if(Number.isInteger(post)) return this.getById({id:post,...options});
    else return this.getBySlug({slug:post,...options});
  }

  insert_or_update(data:any,id:Number | string){
    if(Number.isInteger(id)){
      return this.update(data,id)
    }else{
      return this.insert(data)
    }
  }

  insert(data:any){
    return this.http.post<any>(`${environment.apiUrl}/wp/v2/partners/`,data);
  }
  update(data:any,id:Number | string){
    return this.http.post<any>(`${environment.apiUrl}/wp/v2/partners/${id}`,data);
  }
  delete(item:any){
    return this.http.delete<any>(`${environment.apiUrl}/wp/v2/partners/${item.id}`);
  }


}

