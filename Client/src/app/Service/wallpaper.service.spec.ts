/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WallpaperService } from './wallpaper.service';

describe('Service: Wallpaper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WallpaperService]
    });
  });

  it('should ...', inject([WallpaperService], (service: WallpaperService) => {
    expect(service).toBeTruthy();
  }));
});
