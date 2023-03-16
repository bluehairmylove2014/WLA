import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';
import { sendSignInLinkToEmail, Auth, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
    private router: Router,
    private auth: Auth,
    private afauth: AngularFireAuth
  ) { }
  async AuthLogin(provider: any) {
    return this.afauth
      .signInWithPopup(provider)
      .then(data => {
        
        // Add user to database
        const user_info = data.additionalUserInfo ? data.additionalUserInfo : null;
        if (user_info) {
          const user_profile: any = user_info.profile;
          if(user_profile) {
            if(user_info.isNewUser === false) {
              this.api.loginWithGoogle(user_profile.email.trim()).subscribe((res:any) => {
                const expiresAt = moment().add(res.expiresIn, 'minute');

                // Decode to get username
                let username;
                res.idToken && (this.decode_package = jwt_decode(res.idToken));
                this.decode_package.sub && (username = this.decode_package.sub);

                localStorage.setItem(this.username_keyword, username);
                localStorage.setItem(this.idtoken_keyword, res.idToken);
                localStorage.setItem(this.expires_keyword, JSON.stringify(expiresAt.valueOf()));
                console.log(username);
                

                alert('You have been successfully logged in!')
                this.router.navigate(['']);
              })
            }
            else if(user_info.isNewUser === true) {
              console.log('create');
              const password = '123456';

              this.api.createNewUser(
                user_profile.email.trim(),
                (user_profile.family_name + ' ' + user_profile.given_name).trim(),
                user_profile.picture.trim(),
                password.trim()
              ).subscribe((res:any) => {
                const expiresAt = moment().add(res.expiresIn, 'minute');

                // Decode to get username
                let username;
                res.idToken && (this.decode_package = jwt_decode(res.idToken));
                this.decode_package.sub && (username = this.decode_package.sub);

                localStorage.setItem(this.username_keyword, username);
                localStorage.setItem(this.idtoken_keyword, res.idToken);
                localStorage.setItem(this.expires_keyword, JSON.stringify(expiresAt.valueOf()));

                alert('You have been successfully logged in!')
                this.router.navigate(['']);
              })
            }
          }
          else {
            alert('Error get user profile')
          }
        }
        else {
          alert('Error login. Please try again!')
        }
      })
      .catch(err => {
        console.error(err);
      })
  }
  loginWithFacebook() {
    alert(`
    Xin lỗi, hiện tại website trong quá trình phát triển đang dùng giao thức HTTP, vì tính bảo mật nên không thể sử dụng tính năng này!
    Sorry, the website is currently under development and using the HTTP protocol. Due to security concerns, this feature cannot be used.
    `)
    // return this.AuthLogin(new FacebookAuthProvider);
  }
  loginWithGoogle() {
    return this.AuthLogin(new GoogleAuthProvider);
  }
  login(email: string, password: string): boolean {
    this.api.checkLogin(email, password).subscribe(
      (res: any) => {
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
  logout():void {
    localStorage.removeItem(this.idtoken_keyword);
    localStorage.removeItem(this.expires_keyword);
    localStorage.removeItem(this.username_keyword);
  }
  async register(email: string, name: string, psw: string, cmpsw: string) {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://swallpapers-66098.web.app/__/auth/verification?mode=action&oobCode=code',
      // This must be true.
      handleCodeInApp: true
    };
    await sendSignInLinkToEmail(this.auth, email, actionCodeSettings)
      .then(data => {
        console.log(data);

      })
      .catch(error => {
        console.log(error);

      })
  }
  isLogin():boolean {
    const str = localStorage.getItem(this.expires_keyword) || "";
    if (str == "") return false;
    const expiresAt = JSON.parse(str);
    return moment().isBefore(moment(expiresAt));
  }
  isOwn(username: string): boolean {
    return username === localStorage.getItem(this.username_keyword) ? true : false;
  }
  setUsername(new_usn: string):void {
    localStorage.setItem(this.username_keyword, new_usn);
  }
  getUsername(): string {
    let username = localStorage.getItem(this.username_keyword);
    return username ? username : '';
  }
}
