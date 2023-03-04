import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { MimeType } from '../common/MimeType';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})


export class WallpaperService {
  cur_filename: string = 'swallpapers.jpg';
  cur_mimetype: string = 'image/jpeg';
  base64Image: any;
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

  download(wpp_id: number, image_url: string) {
    const filename = image_url.split('/').pop();
    const ext = filename?.split('.').pop();
    const mimetype = ext ? (new MimeType()).getMimeType(ext) : 'image/jpeg';

    // Get image
    filename && this.api_service.downloadWallpaper(wpp_id, filename).subscribe((res: any) => {
      // Get buffer
      let buffer = res.data;
      const arrayBuffer = new ArrayBuffer(buffer.length);
      
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < buffer.length; ++i) {
        uint8Array[i] = buffer[i];
      }
      // Create url
      const bl = new Blob([arrayBuffer], { type: mimetype });
      const url = URL.createObjectURL(bl);

      // Trigger download
      let link = document.createElement("a");
      link.href = url;
      link.download = filename ? filename : 'swallpapers.jpg';
      document.body.appendChild(link); // for Firefox
      link.click();
      setTimeout(()=> {
        URL.revokeObjectURL(url);
      }, 500)
    })
  }
}
