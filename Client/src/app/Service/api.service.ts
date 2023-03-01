import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Wallpaper } from '../common/Wallpaper';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private REST_API_SERVER = 'http://localhost:2014'

  constructor(
    private http: HttpClient
  ) { }

  // Profile
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
  updateLoveWallpaper(wpp_id:number, user_id: string, type: string) {
    const query = `updateLoveWallpaper`;
    
    this.http.put(`${this.REST_API_SERVER}/api/v1/profile/${query}`, {wpp_id, user_id, type}).subscribe(res=> {

    })
  }
  increaseDownloadWallpaper(wpp_id:any) {
    const query = `increaseDownloadWallpaper`;
    
    this.http.put(`${this.REST_API_SERVER}/api/v1/profile/${query}`, {wpp_id}).subscribe(res=> {

    })
  }
  // Login
  checkLogin(email:string, psw:string) {
    return this.http.post(`${this.REST_API_SERVER}/api/v1/login/checkLogin`, {email, psw});
  }
  // Uploading wallpaper
  uploadWallpaper(data: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    
    return this.http.post(`${this.REST_API_SERVER}/api/v1/wallpaper/upload`, data, { headers });
  }
}
