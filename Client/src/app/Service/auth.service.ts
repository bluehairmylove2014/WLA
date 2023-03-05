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

  private decode_package: any;

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  login(email: string, password: string): boolean {
    this.api.checkLogin(email, password).subscribe(
      (res:any) => {   
        const expiresAt = moment().add(res.expiresIn, 'minute');

        // Decode to get username
        let username;
        res.idToken && (this.decode_package = jwt_decode(res.idToken));
        this.decode_package.sub && (username = this.decode_package.sub);

        localStorage.setItem(this.username_keyword, username);
        localStorage.setItem(this.idtoken_keyword, res.idToken);
        localStorage.setItem(this.expires_keyword, JSON.stringify(expiresAt.valueOf()));
        
        this.router.navigate(['']);
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
  getUsername(): string {
    if(this.isLogin()) {
      let username = localStorage.getItem(this.username_keyword);
      return username ? username : '';
    }
    else {
      this.router.navigate(['login']);
      return '';
    }
  }
}
