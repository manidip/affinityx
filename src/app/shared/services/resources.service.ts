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

    getById(id: number) {
        return this.http.get<any>(`${environment.apiUrl}/wp/v2/resources/${id}`);
    }


}
