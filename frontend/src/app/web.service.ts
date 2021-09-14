import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class WebService {
  readonly ROOT_URL;

  constructor(private http : HttpClient) {
    this.ROOT_URL = environment.apiURL;
  }

  get<Type>(uri: string) {
    return this.http.get<Type>(`${this.ROOT_URL}/${uri}`)
  }

  post<Type>(uri: string, payload: Object) {
    return this.http.post<Type>(`${this.ROOT_URL}/${uri}`, payload)
  }

  delete<Type>(uri: string) {
    return this.http.delete<Type>(`${this.ROOT_URL}/${uri}`)
  }

  put<Type>(uri: string, payload: Object) {
    return this.http.put<Type>(`${this.ROOT_URL}/${uri}`, payload)
  }
}
