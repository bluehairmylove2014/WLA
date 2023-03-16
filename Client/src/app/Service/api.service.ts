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
  getUsernameById(user_id: string): Observable<any> {
    const query = `getUsernameById?user_id=${user_id}`;
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
  getCollection(user_id:string): Observable<any> {
    const query = `getCollection?user_id=${user_id}`;
    return this.http.get(`${this.REST_API_SERVER}/api/v1/profile/${query}`)
  }
  changeInfor(user_id: string, list_change:any): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/api/v1/profile/changeInfor`, {user_id, list_change})
  }
  uploadAvatar(data: FormData) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    
    return this.http.post(`${this.REST_API_SERVER}/api/v1/profile/uploadAvatar`, data, { headers });
  }
  // Interact
  updateLoveWallpaper(wpp_id:number, username: string, type: string) {
    const query = `updateLoveWallpaper`;
    
    this.http.put(`${this.REST_API_SERVER}/api/v1/wallpaper/${query}`, {wpp_id, username, type}).subscribe(res=> {

    })
  }
  updateSaveWallpaper(wpp_id: number, username: string, type: string) {
    const query = `updateSaveWallpaper`;
    
    this.http.put(`${this.REST_API_SERVER}/api/v1/wallpaper/${query}`, {wpp_id, username, type}).subscribe(res=> {

    })
  }
  updateFollow(user_id: string, target_id: string, type: number) {
    const query = `updateFollow`;
    return this.http.put(`${this.REST_API_SERVER}/api/v1/profile/${query}`, {user_id, target_id, type});
  }
  // Login
  checkLogin(email:string, psw:string) {
    return this.http.post(`${this.REST_API_SERVER}/api/v1/login/checkLogin`, {email, psw});
  }
  loginWithGoogle(email:string) {
    const query = `loginWithGoogle?email=${email}`;
    return this.http.get(`${this.REST_API_SERVER}/api/v1/login/${query}`)
  }
  createNewUser(email: string, fullname: string, avatar: string, password: string) {
    return this.http.post(`${this.REST_API_SERVER}/api/v1/login/createUser`, { email, fullname, avatar, password });
  }
  // Wallpaper
  uploadWallpaper(data: FormData) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    
    return this.http.post(`${this.REST_API_SERVER}/api/v1/wallpaper/upload`, data, { headers });
  }
  downloadWallpaper(wpp_id:number, filename: string) {
    const query = `download?wpp_id=${wpp_id}&filename=${filename}`
    return this.http.get(`${this.REST_API_SERVER}/api/v1/wallpaper/${query}`);
  }
  getSpotlightWallpaper(start: number, numof_wallpaper: number) {
    const query = `getSpotlightWallpaper?start=${start}&numof_wallpaper=${numof_wallpaper}`
    return this.http.get(`${this.REST_API_SERVER}/api/v1/wallpaper/${query}`);
  }
  // get request
  getRequest(url: string, options: any) {
    return this.http.get(url, options);
  }
  // Search
  searchFor(type: string, key: string): Observable<any> {
    const query = `searchFor?type=${type}&key=${key}`
    return this.http.get(`${this.REST_API_SERVER}/api/v1/s/${query}`);
  }
}
