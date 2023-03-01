import { Injectable } from '@angular/core';
import { Wallpaper } from '../common/Wallpaper';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WallpaperService {

  constructor(
    private api_service: ApiService
  ) { }

  upload(
    username: string,
    name: string,
    tags: string,
    des: string,
    file: any
  ): void {
    // Send to server
    
    let formData = new FormData();
    formData.append('username', username);
    formData.append('file', file, file.name);

    this.api_service.uploadWallpaper(formData).subscribe(
      (res: any) => {
      }
    );
  }
}
