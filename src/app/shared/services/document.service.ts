import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) {}

  getAll(options:any) {
    if(!options.page)  options['page'] = 1;
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/documents`,{ params: {...options},observe: "response" })
  }

  getById(options:any) {
      let id = options.id;
      delete options['id'];
      return this.http.get<any>(`${environment.apiUrl}/wp/v2/documents/${id}`,{observe: "response" });
  }
  getBySlug(options:any) {
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/documents/`,{ params: {...options},observe: "response" });
  }

  getBy(options:any) {
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
    return this.http.post<any>(`${environment.apiUrl}/wp/v2/documents/`,data);
  }
  update(data:any,id:Number | string){
    return this.http.post<any>(`${environment.apiUrl}/wp/v2/documents/${id}`,data);
  }
  delete(item:any){
    return this.http.delete<any>(`${environment.apiUrl}/wp/v2/documents/${item.id}`);
  }

  download(id:Number){
    return this.http.get(`${environment.apiUrl}/wp/v2/documents/download/${id}`,{observe: 'events',responseType: 'blob',reportProgress: true})
    // .pipe(
    //   map((response: any) => {
    //     let data = {
    //       file: new Blob([response.body], {type: response.headers.get('Content-Type')}),
    //    }
    //     return data ;
    //   })
    // )
  }
}
