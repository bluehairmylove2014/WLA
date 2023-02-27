import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import * as moment  from 'moment';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private idtoken_keyword = 'id_token';
  private expires_keyword = 'expires_at';
  private username_keyword = 'username';

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  login(email: string, password: string): boolean {
    this.api.checkLogin(email, password).subscribe(
      (res:any) => {   
        const expiresAt = moment().add(res.expiresIn, 'minute');
        localStorage.setItem(this.idtoken_keyword, res.idToken);
        localStorage.setItem(this.expires_keyword, JSON.stringify(expiresAt.valueOf()));

        // Decode to get username
        let username: any;
        res.idToken && (username = jwt_decode(res.idToken));

        this.router.navigate(['/profile/' + username.sub]);
        return true;
      }
    )
    return false;
  }
  logout() {
    localStorage.removeItem(this.idtoken_keyword);
    localStorage.removeItem(this.expires_keyword);
    localStorage.removeItem(this.username_keyword);
  }
  isLogin() {
    const str = localStorage.getItem(this.expires_keyword) || "";
    if (str=="") return false;  
    const expiresAt = JSON.parse(str);    
    return moment().isBefore(moment(expiresAt));
  }
  getLoginToken(): string | null {
    return localStorage.getItem(this.idtoken_keyword);
  }
}
