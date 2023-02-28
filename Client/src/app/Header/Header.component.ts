import { Component, ComponentFactoryResolver, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
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
  @Input() user_avatar: string = '../../assets/user/avt/default_avt.png'
  @Input() username: string = '../../assets/user/avt/default_avt.png'
  @ViewChild('uploadContainer', {read: ViewContainerRef}) uploadContainerRef!: ViewContainerRef;

  // Listener
  avtdropdown_listener: () => void;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private auth_service: AuthService,
  ) { 
    this.avtdropdown_listener = () => {}
  }
  logOut() {
    this.auth_service.logout();
    this.router.navigate(['login'])
  }
  uploadWallpaper() {
    this.uploadContainerRef.createComponent(UploadWallpaperComponent);
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

  ngOnInit() {
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.avtdropdown_listener();
  }
}
