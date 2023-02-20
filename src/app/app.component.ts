import { Component } from '@angular/core';
import { User } from './common/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WallpaperLibrary';

  user: User = {
    id: null,
    email: null,
    avt: null,
    usn: null,
    psw: null,
    name: null,
    type: 'anonymous',
    status: null,
    createat: null,
    location: {
      Street: null,
      District: null,
      Province: null,
      City: null,
      Country: null
    },
    follower: null
  };

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    
    this.user = {
      id: 1,
      email: 'baphuong2014@gmail.com',
      avt: '../../assets/user/avt/bluegirl2014.png',
      usn: 'bluegirl2014',
      psw: '123456',
      name: 'Nguyễn Ba Phương',
      type: 'user',
      status: 'normal',
      createat: '5/1/2014',
      location: {
        Street: null,
        District: null,
        Province: null,
        City: 'Hanoi',
        Country: 'Vietnam'
      },
      follower: []
    };
  }
}
