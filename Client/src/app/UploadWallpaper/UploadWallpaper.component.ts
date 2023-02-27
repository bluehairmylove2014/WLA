import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-UploadWallpaper',
  templateUrl: './UploadWallpaper.component.html',
  styleUrls: ['./UploadWallpaper.component.css']
})
export class UploadWallpaperComponent implements OnInit {
  @ViewChild('dragdropfield') ddfRef!: ElementRef;
  @ViewChild('btn_wrapper') btnWrapperRef!: ElementRef;
  @ViewChild('previewImg') previewImgRef!: ElementRef;
  @ViewChild('inforHolder') inforHolderRef!: ElementRef;
  @ViewChild('uploadMain') uploadMainRef!: ElementRef;
  @ViewChild('main') componentBodyRef!: ElementRef;

  // Var
  imageUrl: string | null = null;
  listener = () => {}

  constructor(
    private renderer: Renderer2
  ) { }

  // Methods
  onClickUpload() {
    this.previewImgRef.nativeElement.style.filter = 'blur(5px) brightness(0.6)';
    this.renderer.addClass(this.inforHolderRef.nativeElement, 'active');
    setTimeout(() => {
      this.listener = this.renderer.listen(this.uploadMainRef.nativeElement, 'click', (event) => {
        if(event.target && !this.inforHolderRef.nativeElement.contains(event.target)) {
          this.renderer.removeClass(this.inforHolderRef.nativeElement, 'active');
          this.previewImgRef.nativeElement.style.filter = 'none';
          this.listener && this.listener();
        }
      })
    }, 300);
  }
  onCancelUpload() {
    this.renderer.removeClass(this.componentBodyRef.nativeElement, 'active');
  }
  browseWallpaper() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
      // // you can use this method to get file and perform respective operations
      let file = input.files && input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      file && reader.readAsDataURL(file);
    };
    input.click();
  }
  previewWallpaper() {
    const input = this.ddfRef.nativeElement.querySelector('.drag-drop-input');
    const file = input.files && input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    file && reader.readAsDataURL(file);

    this.ddfRef.nativeElement.style.display = 'none';

    const browse_btn = this.btnWrapperRef.nativeElement.querySelector('.browse-btn');
    browse_btn && (browse_btn.style.display = 'block');

    const upload_btn = this.btnWrapperRef.nativeElement.querySelector('.upload-btn');
    upload_btn && (upload_btn.style.cursor = 'pointer');
  }
  onDrop(event: DragEvent) {
    console.log("go");

    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.match(/image\/*/) == null) {
        console.log('Only images are supported.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.imageUrl = event.target?.result as string;
      };
    }
  }
  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    let curTarget = event.target as HTMLElement;
    if (curTarget) {
      if (curTarget.tagName === 'BUTTON') {
        curTarget = curTarget.parentElement || curTarget;
      }
      const browseBtn = curTarget.querySelector('.drag-drop-img');
      browseBtn && this.renderer.addClass(browseBtn, 'unactive');
      curTarget.style.backgroundColor = 'rgb(228, 218, 218)';
    }
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    let cur_target = event.target as HTMLElement;
    // event target tagname is on uppercase 
    if (cur_target) {
      if (cur_target.tagName === 'BUTTON') {
        cur_target = cur_target.parentElement ? cur_target.parentElement : cur_target;
      }
      const browse_btn = cur_target.querySelector('.drag-drop-img');
      browse_btn && this.renderer.removeClass(browse_btn, 'unactive');
      cur_target.style.backgroundColor = 'transparent';
    }
  }
  ngOnInit() {
  }

}
