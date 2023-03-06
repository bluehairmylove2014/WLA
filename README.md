
# WallpaperLibrary-Angular
Giới thiệu
WallpaperLibrary-Angular là một ứng dụng web cho phép người dùng xem và tải xuống những bức ảnh nền đẹp nhất từ Internet. Ứng dụng được xây dựng trên framework Angular và sử dụng các công nghệ web mới nhất để cung cấp cho người dùng trải nghiệm tốt nhất.

# Tính năng

- Xem danh sách các bức ảnh nền đẹp nhất
- Tìm kiếm ảnh nền theo từ khóa
- Xem thông tin chi tiết của một bức ảnh nền
- Tải xuống ảnh nền yêu thích
- Lưu ảnh nền tạo thành một bộ sưu tập

# Công nghệ sử dụng

- __FRONT-END__: Angular/Bootstrap
- __BACK-END__: Nodejs
- __HTML/CSS/Typescript/Javascript__
- __RxJS__
- __Database__: PostgreSQL
- __Wallpaper Storage__: SIRV.COM ( Hỗ trợ lưu ảnh, tải ảnh, upload ảnh thông qua API )
- __Authentication__: Firebase Authentication và JWT ( JSON Web Token )

# Hướng dẫn cài đặt
Để chạy ứng dụng trên máy tính của bạn, bạn cần cài đặt các phần mềm sau đây:

- Node.js (phiên bản mới nhất)
- Angular CLI (15) 
` npm install -g @angular/cli `
- Sau khi cài đặt xong, bạn thực hiện các bước sau:

- Clone repo từ github về máy tính của bạn:
` git clone https://github.com/bluehairmylove2014/WallpaperLibrary-Angular.git `

- Mở command prompt và truy cập vào thư mục chứa mã nguồn của repo:
` cd WallpaperLibrary-Angular `

- Cài đặt các package cần thiết bằng lệnh (cả trong 2 folder Client và Server):
` npm install `

- Trong folder Database có một file script, chạy file và cấu hình postgreSQL cho phù hợp ( username, password, ... trong db/index.js phía Server )

- Chạy Server trước bằng lệnh: ` npm start `
- Tiếp đến chạy Client bằng lệnh: ` ng serve -o `
- Mở trình duyệt và truy cập vào địa chỉ http://localhost:4200/ để sử dụng ứng dụng.

# Tác giả
__Phan Phúc Đạt__  
Nếu bạn có bất kỳ câu hỏi hoặc đóng góp nào cho ứng dụng, vui lòng liên hệ tác giả qua email: __bluehairmylove2014@gmail.com.__

# Giấy phép
Ứng dụng được phân phối theo giấy phép MIT. Xem thêm chi tiết trong file LICENSE.


# WallpaperLibrary-Angular
# Introduction

WallpaperLibrary-Angular is a web application that allows users to view and download the most beautiful wallpapers from the Internet. The application is built on the Angular framework and uses the latest web technologies to provide users with the best experience.

# Features

- View a list of the most beautiful wallpapers
- Search for wallpapers by keywords
- View detailed information about a wallpaper
- Download favorite wallpapers
- Save wallpapers to a collection

# Technologies Used

- __FRONT-END__: Angular/Bootstrap
- __BACK-END__: Node.js
- __HTML/CSS/Typescript/Javascript__
- __RxJS__
- __Database: PostgreSQL__
- __Wallpaper Storage__: SIRV.COM (supports storing, downloading, and uploading images through API)
- __Authentication__: Firebase Authentication and JWT (JSON Web Token)

# Installation Guide

To run the application on your computer, you need to install the following software:

- Node.js (latest version)

- Angular CLI (15 or above)
`npm install -g @angular/cli`

- After installation, follow these steps:

- Clone the repository to your computer:
`git clone https://github.com/bluehairmylove2014/WallpaperLibrary-Angular.git`

- Open a command prompt and navigate to the directory containing the source code of the repository:
`cd WallpaperLibrary-Angular`

- Install the necessary packages with the command (in both Client and Server folders):
`npm install`

- In the Database folder, there is a script file. Run the file and configure PostgreSQL appropriately (username, password, ... in db/index.js on the Server)

- Start the Server with the command: `npm start`

- Then start the Client with the command: `ng serve -o`

- Open your browser and go to http://localhost:4200/ to use the application.

# Author

__Phan Phuc Dat__  
If you have any questions or contributions to the application, please contact the author via email: bluehairmylove2014@gmail.com.

# License

The application is distributed under the MIT license. See more details in the LICENSE file.
