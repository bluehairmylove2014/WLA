import { 
  Component, 
  OnInit, 
  ChangeDetectorRef, 
  NgZone, 
  Renderer2, 
  ViewChild, 
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
// Interface
import { User } from '../common/User';
//API
import { ApiService } from '../Service/api.service'; 
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('home') home_holder!: ElementRef;
  @ViewChild('saloginholder') saloginholder!: ElementRef;

  click_listener: () => void;
  keypress_listener: () => void;
  user_account: User = {} as User;

  constructor(
    private cd: ChangeDetectorRef, 
    private renderer: Renderer2, 
    private ngZone: NgZone,
    private router: Router,
    private api_service: ApiService,
    private auth_service : AuthService
  ) { 
    // initialize listener
    this.click_listener = () => {}
    this.keypress_listener = () => {}
  }

  ngOnInit() {
  }
  // Methods
  loginFocus(target: string):void {
    const email_input = this.saloginholder.nativeElement.querySelector(`#${target}-input`);
    const email_val = email_input ? email_input.value.trim() : '';

    if(email_val.length === 0) {
      const lbl = this.saloginholder.nativeElement.querySelector(`#${target}-label`);
      if(lbl) {
        this.renderer.setStyle(lbl, 'left', '5px');
        this.renderer.setStyle(lbl, 'opacity', '0');
      }
    }
  }
  loginBlur(target: string):void {
    const psw_input = this.saloginholder.nativeElement.querySelector(`#${target}-input`);
    const psw_val = psw_input ? psw_input.value.trim() : '';

    if(psw_val.length === 0) {
      const lbl = this.saloginholder.nativeElement.querySelector(`#${target}-label`);
      if(lbl) {
        this.renderer.setStyle(lbl, 'opacity', '1');
        this.renderer.setStyle(lbl, 'left', '10%');
      }
    }
  }
  hideLoginForm(holder: any, loginForm: any): void {
    this.renderer.setStyle(holder, 'background-image', 'none');
    this.renderer.setStyle(holder, 'pointer-events', 'all');
    this.renderer.setStyle(holder, 'background-color', 'black');
    this.renderer.setStyle(holder, 'color', 'white');
    this.renderer.setStyle(holder, 'height', '47px');
    this.renderer.setStyle(holder, 'padding-top', '0px');
    this.renderer.setStyle(holder, 'display', 'block');

    this.renderer.setStyle(loginForm, 'opacity', '0');
    this.renderer.setStyle(loginForm, 'visibility', 'hidden');

    // disable error noti
    this.disableErrorNoti();

    
    const email_input = this.saloginholder.nativeElement.querySelector('#email-input');
    if(email_input) {
      email_input.value = '';
      this.loginBlur('email');
    }
    const psw_input = this.saloginholder.nativeElement.querySelector('#psw-input');
    if(psw_input) {
      psw_input.value = ''
      this.loginBlur('psw');
    }

    // Stop listener
    if(this.click_listener) {
      this.click_listener();
    }
    if(this.keypress_listener) {
      this.keypress_listener();
    }
  }
  showLoginForm(holder: any, loginForm: any): void {
    if(holder && loginForm) {
      // CSS button
      this.renderer.setStyle(holder, 'background-image', 'url("../../assets/bgs/lgbtn-bg.jpg")');       
      this.renderer.setStyle(holder, 'background-repeat', 'no-repeat');
      this.renderer.setStyle(holder, 'background-size', 'cover');

      this.renderer.setStyle(holder, 'pointer-events', 'none');
      this.renderer.setStyle(holder, 'background-color', 'white');
      this.renderer.setStyle(holder, 'color', 'black');
      this.renderer.setStyle(holder, 'padding-top', '80px');
      this.renderer.setStyle(holder, 'height', '500px');
      this.renderer.setStyle(holder, 'display', 'flex');
      this.renderer.setStyle(holder, 'flex-direction', 'row');
      this.renderer.setStyle(holder, 'justify-content', 'center');
      // CSS login form
      this.renderer.setStyle(loginForm, 'visibility', 'visible');
      this.renderer.setStyle(loginForm, 'opacity', '1');

      // Add click eventListener
      const clickField = this.home_holder.nativeElement;
      const mustTarget = this.saloginholder.nativeElement.querySelector('.btn-wrapper');
      if(mustTarget && clickField) {
        this.click_listener = this.renderer.listen(clickField, 'click', (event) => {
          if (event.target && !mustTarget.contains(event.target)) {
            // Click outsite!
            this.hideLoginForm(holder, loginForm)
          }
        });
        
        // Add press enter listener for commit-login-btn
        this.keypress_listener = this.renderer.listen(clickField, 'keypress', (event) => {
          if(event.key === 'Enter') {
            this.commitSALogin()
          }
        })
      }
    }
  }
  loginSunriseAccount(): void {
    const btn = this.saloginholder.nativeElement.querySelector('.login-btn');
    const loginForm = this.saloginholder.nativeElement.querySelector('.login-form');
    
    this.ngZone.run(() => {
      this.showLoginForm(btn, loginForm)
    })
  }

  // Login with google handle
  loginWithGoogle(): void {
    // this.router.navigate(['/profile', this.user_account.user_id]);
  }
  checkEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  enableErrorNoti(noti_data: string):void {
    const error_noti = this.saloginholder.nativeElement.querySelector('.login-error-notification');
    if(error_noti) {
      this.renderer.addClass(error_noti, 'active');
      const error_noti_content = this.saloginholder.nativeElement.querySelector('#error-noti-content');
      if(error_noti_content) {
        this.renderer.setProperty(error_noti_content, 'innerHTML', noti_data);
      }
    }
  }
  disableErrorNoti():void {
    const error_noti = this.saloginholder.nativeElement.querySelector('.login-error-notification');
    if(error_noti) {
      this.renderer.removeClass(error_noti, 'active');
    }
  }
  commitSALogin(): void {
    const email_input = this.saloginholder.nativeElement.querySelector('#email-input');
    const email_val = email_input ? email_input.value.trim() : '';
    const psw_input = this.saloginholder.nativeElement.querySelector('#psw-input');
    const psw_val = psw_input ? psw_input.value.trim() : '';

    // Check empty input
    if(email_val === '') {
      this.enableErrorNoti('Please fill your email');
    }
    else if(psw_val === '') {
      this.enableErrorNoti('Please fill your password');
    }
    // Check email valid
    else if(!this.checkEmailValid(email_val)) {
      this.enableErrorNoti('Your email is not valid');
    }
    // Check valid login
    else {
      if(!this.auth_service.login(email_val, psw_val)) {
        // Login fail
        this.enableErrorNoti('Wrong email or password');
      }
    }
  }

  ngAfterViewInit(): void {
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    if(this.click_listener) {
      this.click_listener();
    }
    if(this.keypress_listener) {
      this.keypress_listener();
    }
  }
}

