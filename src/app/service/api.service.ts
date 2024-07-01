import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http
      .get<any>("https://665811285c3617052646c27f.mockapi.io/api/data/Tagdata")
  }
}
