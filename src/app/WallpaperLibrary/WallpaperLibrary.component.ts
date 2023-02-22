
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
// Import Component
import { Wallpaper } from '../common/Wallpaper';

@Component({
  selector: 'app-WallpaperLibrary',
  templateUrl: './WallpaperLibrary.component.html',
  styleUrls: ['./WallpaperLibrary.component.css']
})
export class WallpaperLibraryComponent implements OnInit {
  @Input() wallpapers_data: Wallpaper[] = [] as Wallpaper[];
  // Referrences
  @ViewChild('wpps') wallpaperHolder!: ElementRef;
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;

  // Variables
  masonryOptions = {
    transitionDuration: '0.2s',
    gutter: 0,
    resize: true,
    initLayout: true
  };

  constructor(
    private cd: ChangeDetectorRef
  ) { }
  // Methods
  countArray(n: number): number[] {
    if (n > 4) {
      return Array.from({ length: n }, (_, i) => i + 1);
    }
    else {
      return Array.from({ length: n }, (_, i) => i + 1);
    }
  }
  reloadLayout() {
    this.masonry.reloadItems();
    this.masonry.layout();
  }
  // Hook
  ngOnInit() {
  }
  ngAfterViewInit(): void {

    this.cd.markForCheck();
  }
}
