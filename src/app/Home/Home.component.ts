import { 
  Component, 
  OnInit, 
  ChangeDetectorRef, 
  NgZone, 
  Renderer2, 
  ViewChild, 
  ElementRef,  
  Input
} from '@angular/core';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() user_account: any;
  @ViewChild('home') home_holder!: ElementRef;
  @ViewChild('saloginholder') saloginholder!: ElementRef;

  listener: () => void;

  constructor(
    private cd: ChangeDetectorRef, 
    private renderer: Renderer2, 
    private ngZone: NgZone,
  ) { 
    this.listener = () => {
      
    }
  }

  ngOnInit() {}
  // Methods
  loginFocus(target: string):void {
    const lbl = this.saloginholder.nativeElement.querySelector(`.${target}-label`);
    if(lbl) {
      this.renderer.setStyle(lbl, 'left', '5px');
      this.renderer.setStyle(lbl, 'opacity', '0');
    }
  }
  loginBlur(target: string):void {
    const lbl = this.saloginholder.nativeElement.querySelector(`.${target}-label`);
    if(lbl) {
      this.renderer.setStyle(lbl, 'opacity', '1');
      this.renderer.setStyle(lbl, 'left', '10%');
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
      setTimeout(() => {
        const clickField = this.home_holder.nativeElement;
        const mustTarget = this.saloginholder.nativeElement.querySelector('.btn-wrapper');
        if(mustTarget) {
          this.listener = this.renderer.listen(clickField, 'click', (event) => {
            if (event.target && !mustTarget.contains(event.target)) {
              console.log('outsite')
              // Click outsite!
              this.hideLoginForm(holder, loginForm)
              // Stop listener
              if(this.listener) {
                this.listener();
              }
            }
            else {
              console.log('insite')
            }
          });
        }
      }, 500);
    }
  }
  loginSunriseAccount() {
    const btn = this.saloginholder.nativeElement.querySelector('.login-btn');
    const loginForm = this.saloginholder.nativeElement.querySelector('.login-form');
    
    this.ngZone.run(() => {
      this.showLoginForm(btn, loginForm)
    })
  }

  ngAfterViewInit(): void {
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    if(this.listener) {
      this.listener();
    }
  }
}
