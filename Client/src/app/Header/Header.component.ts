import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import { ApiService } from '../Service/api.service';
// Sub component
import { UploadWallpaperComponent } from '../UploadWallpaper/UploadWallpaper.component';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('uploadContainer', {read: ViewContainerRef}) uploadContainerRef!: ViewContainerRef;
  @ViewChild('notiContent') notiContentRef!: ElementRef;
  @ViewChild('searchbox') searchboxRef!: ElementRef;
  notifications: Notification[] = [] as Notification[];
  islogin: boolean = false;
  user_avatar!: string;
  username!: string;
  // Listener
  avtdropdown_listener: () => void;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private auth_service: AuthService,
    private api_service: ApiService
  ) { 
    this.avtdropdown_listener = () => {}
  }

  @HostListener('window:keypress', ['$event'])
  onSearch(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      let key_search = this.searchboxRef.nativeElement.value.trim();
      if(key_search.length) {
        this.router.navigate(['s', 'photos', key_search])
      }
    }
  }

  search() {
    let key_search = this.searchboxRef.nativeElement.value.trim();
    if(key_search.length) {
      this.router.navigate(['s', 'photos', key_search])
    }
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
  generateRandomVersion(): string {
    const length = Math.floor(Math.random() * 10) + 5; // độ dài từ 5 đến 14 ký tự
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  ngOnInit() {
    // Check login
    if(this.auth_service.isLogin()) {
      // Get user information
      this.username = this.auth_service.getUsername();
      this.username.length && this.api_service.getUser(this.username).subscribe(data => {
        data[0] && (this.user_avatar = (data[0].avatar + `?v=${this.generateRandomVersion()}`));
      })
      this.islogin = true;
    }
    else {
      this.islogin = false;
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.avtdropdown_listener();
  }
}
