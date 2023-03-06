
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
