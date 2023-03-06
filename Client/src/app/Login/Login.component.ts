import { 
  Component, 
  OnInit, 
  ChangeDetectorRef, 
  NgZone, 
  Renderer2, 
  ViewChild, 
  ElementRef
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('home') homeHolderRef!: ElementRef;
  @ViewChild('saloginholder') saloginholderRef!: ElementRef;
  @ViewChild('loginField') loginFieldRef!: ElementRef;
  @ViewChild('registerField') registerFieldRef!: ElementRef;
  @ViewChild('registerErrorNoti') registerErrorNotiRef!: ElementRef;
  @ViewChild('loginErrorNoti') loginErrorNotiRef!: ElementRef;

  click_listener: () => void;
  keypress_listener: () => void;
  user_account: User = {} as User;
  registerForm = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    psw: new FormControl(''),
    cmpsw: new FormControl('')
  })

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

  // Methods
  inputFocus(target: string, formType: string):void {
    let holder: any;
    if(formType === 'login') {
      holder = this.saloginholderRef.nativeElement;
    }
    else if(formType === 'register') {
      holder = this.registerFieldRef.nativeElement;
    }
    else {
      console.log('error identify input form');
    }
    const email_input = holder.querySelector(`#${target}-input`);
    const email_val = email_input ? email_input.value.trim() : '';

    if(email_val.length === 0) {
      const lbl = holder.querySelector(`#${target}-label`);
      if(lbl) {
        this.renderer.setStyle(lbl, 'left', '5px');
        this.renderer.setStyle(lbl, 'opacity', '0');
      }
    }
  }
  inputBlur(target: string, formType: string):void {
    let holder: any;
    if(formType === 'login') {
      holder = this.saloginholderRef.nativeElement;
    }
    else if(formType === 'register') {
      holder = this.registerFieldRef.nativeElement;
    }
    else {
      console.log('error identify input form');
    }
    const psw_input = holder.querySelector(`#${target}-input`);
    const psw_val = psw_input ? psw_input.value.trim() : '';

    if(psw_val.length === 0) {
      const lbl = holder.querySelector(`#${target}-label`);
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

    
    const email_input = this.saloginholderRef.nativeElement.querySelector('#email-input');
    if(email_input) {
      email_input.value = '';
      this.inputBlur('email', 'login');
    }
    const psw_input = this.saloginholderRef.nativeElement.querySelector('#psw-input');
    if(psw_input) {
      psw_input.value = ''
      this.inputBlur('psw', 'login');
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
      const clickField = this.homeHolderRef.nativeElement;
      const mustTarget = this.saloginholderRef.nativeElement.querySelector('.btn-wrapper');
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
    const btn = this.saloginholderRef.nativeElement.querySelector('.login-btn');
    const loginForm = this.saloginholderRef.nativeElement.querySelector('.login-form');
    
    this.ngZone.run(() => {
      this.showLoginForm(btn, loginForm)
    })
  }

  // Login with google handle
  loginWithGoogle(): void {
    this.auth_service.loginWithGoogle();
  }
  checkEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  enableErrorNoti(noti_data: string, noti_element: any):void {
    if(noti_element) {
      this.renderer.addClass(noti_element, 'active');
      const error_noti_content = noti_element.querySelector('p');
      if(error_noti_content) {
        this.renderer.setProperty(error_noti_content, 'innerHTML', noti_data);
      }
    }
  }
  disableErrorNoti():void {
    const error_noti = this.saloginholderRef.nativeElement.querySelector('.login-error-notification');
    if(error_noti) {
      this.renderer.removeClass(error_noti, 'active');
    }
  }
  commitSALogin(): void {
    const email_input = this.saloginholderRef.nativeElement.querySelector('#email-input');
    const email_val = email_input ? email_input.value.trim() : '';
    const psw_input = this.saloginholderRef.nativeElement.querySelector('#psw-input');
    const psw_val = psw_input ? psw_input.value.trim() : '';

    // Check empty input
    if(email_val === '') {
      this.enableErrorNoti('Please fill your email', this.loginErrorNotiRef.nativeElement);
    }
    else if(psw_val === '') {
      this.enableErrorNoti('Please fill your password', this.loginErrorNotiRef.nativeElement);
    }
    // Check email valid
    else if(!this.checkEmailValid(email_val)) {
      this.enableErrorNoti('Your email is not valid', this.loginErrorNotiRef.nativeElement);
    }
    // Check valid login
    else {
      if(!this.auth_service.login(email_val, psw_val)) {
        // Login fail
        this.enableErrorNoti('Wrong email or password', this.loginErrorNotiRef.nativeElement);
      }
    }
  }
  commitSARegister(): void {
    const email = this.registerForm.get('email')?.value?.trim();
    const name = this.registerForm.get('name')?.value?.trim();
    const psw = this.registerForm.get('psw')?.value?.trim();
    const cmpsw = this.registerForm.get('cmpsw')?.value?.trim();

    if(email === undefined || name === undefined || psw === undefined || cmpsw === undefined) {
      console.error('Error when get register data');
      return;
    }

    // Check empty input
    if(!email.length) {
      console.log(this.registerErrorNotiRef.nativeElement);
      
      this.enableErrorNoti('Please fill your email', this.registerErrorNotiRef.nativeElement);
    }
    else if(!name.length) {
      this.enableErrorNoti('Please fill your name', this.registerErrorNotiRef.nativeElement);
    }
    else if(!psw.length) {
      this.enableErrorNoti('Please fill your password', this.registerErrorNotiRef.nativeElement);
    }
    else if(!cmpsw.length) {
      this.enableErrorNoti('Please fill your commit password', this.registerErrorNotiRef.nativeElement);
    }
    // Check email valid
    else if(!this.checkEmailValid(email)) {
      this.enableErrorNoti('Your email is not valid', this.registerErrorNotiRef.nativeElement);
    }
    // Check commit password match password
    else if(psw !== cmpsw) {
      this.enableErrorNoti('Commit password is not match with password', this.registerErrorNotiRef.nativeElement);
    }
    // Check valid login
    else {
      this.auth_service.register(email, name, psw, cmpsw);
    }
    
  }
  goRegister() {
    this.renderer.removeClass(this.loginFieldRef.nativeElement, 'active');
    this.renderer.addClass(this.registerFieldRef.nativeElement, 'active');
  }
  goLogin() {
    this.renderer.addClass(this.loginFieldRef.nativeElement, 'active');
    this.renderer.removeClass(this.registerFieldRef.nativeElement, 'active');
  }

  ngOnInit() {
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

