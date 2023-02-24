import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private REST_API_SERVER = 'http://localhost:2014'

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    const query = `getAll`;
    return this.http.get(`${this.REST_API_SERVER}/api/v1/profile/${query}`)
  }
  getUser(username: string): Observable<any> {
    const query = `getUser?username=${username}`;
    return this.http.get(`${this.REST_API_SERVER}/api/v1/profile/${query}`)
  }
  getWallpapers(user_id:string): Observable<any> {
    const query = `getWallpapers?user_id=${user_id}`;
    return this.http.get(`${this.REST_API_SERVER}/api/v1/profile/${query}`)
  }
  getAlbums(user_id:string): Observable<any> {
    const query = `getAlbums?user_id=${user_id}`;
    return this.http.get(`${this.REST_API_SERVER}/api/v1/profile/${query}`)
  }
  increaseLoveWallpaper(wpp_id:any) {
    const query = `increaseLoveWallpaper`;
    
    this.http.put(`${this.REST_API_SERVER}/api/v1/profile/${query}`, {wpp_id}).subscribe(res=> {

    })
  }
  increaseDownloadWallpaper(wpp_id:any) {
    const query = `increaseDownloadWallpaper`;
    
    this.http.put(`${this.REST_API_SERVER}/api/v1/profile/${query}`, {wpp_id}).subscribe(res=> {

    })
  }
  decreaseLoveWallpaper(wpp_id:any) {
    const query = `decreaseLoveWallpaper`;
    
    this.http.put(`${this.REST_API_SERVER}/api/v1/profile/${query}`, {wpp_id}).subscribe(res=> {

    })
  }

  checkLogin(email:string, psw:string): Observable<any> {
    const query = `checkLogin?email=${email}&psw=${psw}`;
    return this.http.get(`${this.REST_API_SERVER}/api/v1/home/${query}`)
  }
}
