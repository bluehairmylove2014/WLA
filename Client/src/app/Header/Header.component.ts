import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';
// Sub component
import { UploadWallpaperComponent } from '../UploadWallpaper/UploadWallpaper.component';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() islogin: boolean = false;
  @Input() user_avatar: string = '../../assets/user/avt/default_avt.png'
  @Input() username: string = '../../assets/user/avt/default_avt.png'
  @ViewChild('uploadContainer', {read: ViewContainerRef}) uploadContainerRef!: ViewContainerRef;
  @ViewChild('notiContent') notiContentRef!: ElementRef;

  notifications: Notification[] = [] as Notification[];
  // Listener
  avtdropdown_listener: () => void;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private auth_service: AuthService,
    private cd: ChangeDetectorRef
  ) { 
    this.avtdropdown_listener = () => {}
  }
  logOut() {
    Number.parseInt
    this.auth_service.logout();
    this.router.navigate(['login'])
  }
  goProfile() {
    this.router.navigate(['profile', this.username])
  }
  goCollection() {
    this.router.navigate(['profile', this.username, 'collection'])
  }
  uploadWallpaper() {
    let sub_component = this.uploadContainerRef.createComponent(UploadWallpaperComponent);
    sub_component.instance.username = this.username;
  }
  showAvtDropdown(event: any) {
    const dropdown_content = event.target.parentElement.querySelector('.nav-dropdown-content');
    if(dropdown_content) {
      // Check if dropdown is showed or not
      if(dropdown_content.classList.contains('active')) {
        dropdown_content.classList.remove('active');
        this.avtdropdown_listener();
      }
      else {
        dropdown_content.classList.add('active');
        // Delay prevent over click but user dont recornize
        setTimeout(() => {
          this.avtdropdown_listener = this.renderer.listen(document, 'click', (event) => {
            if(event.target && !dropdown_content.contains(event.target)) {
              dropdown_content.classList.remove('active');
              this.avtdropdown_listener();
            }
          })
        }, 300);
      }
    }
  }
  showNoti() {
    const notiField = this.notiContentRef.nativeElement;
    if(notiField) {
      if(!notiField.classList.contains('active')) {
        this.renderer.addClass(notiField, 'active')
      }
      else {
        this.renderer.removeClass(notiField, 'active')
      }
    }
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.avtdropdown_listener();
  }
}
