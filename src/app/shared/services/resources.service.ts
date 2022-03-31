import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {


    public perPage = environment.defaultPerPage;

    constructor(private http: HttpClient) {}


    getAll(page?: number) {
      page = (page) ? page : 1;
      return this.http.get<any>(`${environment.apiUrl}/wp/v2/resources?page=${page}&per_page=${this.perPage}`,{ observe: "response" })
    }

    getById(options:any) {
      let id = options.id;
      delete options['id'];
      return this.http.get<any>(`${environment.apiUrl}/wp/v2/resources/${id}`,{observe: "response" });
  }
  getBySlug(options:any) {
    return this.http.get<any>(`${environment.apiUrl}/wp/v2/resources/`,{ params: {...options},observe: "response" });
  }

  getBy(options:any) {
    let post = options['post'];
    delete options['post'];
    if(Number.isInteger(post)) return this.getById({id:post,...options});
    else return this.getBySlug({slug:post,...options});
  }

}
