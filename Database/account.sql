-- Xóa bảng user_detail nếu đã tồn tại
DROP TABLE IF EXISTS collection;
-- DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS user_detail;
DROP TABLE IF EXISTS wallpapers;
DROP TABLE IF EXISTS accounts;

-- Tạo bảng account
CREATE TABLE accounts (
  user_id TEXT PRIMARY KEY NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT UNIQUE NOT NULL,
  display_name VARCHAR(50) UNIQUE NOT NULL,
  account_type VARCHAR(10) NOT NULL,
  account_status VARCHAR(10) NOT NULL,
  createat TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tạo bảng user_detail
CREATE TABLE user_detail (
  user_id TEXT REFERENCES accounts(user_id),
  following TEXT[],
  follower TEXT[],
  location JSONB
);

-- Tạo bảng wallpapers
CREATE TABLE wallpapers (
  user_id TEXT REFERENCES accounts(user_id),
  wpp_id SERIAL PRIMARY KEY,
  artist_name VARCHAR(50) REFERENCES accounts(display_name),
  artist_img TEXT REFERENCES accounts(avatar),
  wpp_path TEXT NOT NULL,
  wpp_tags TEXT NOT NULL,
  wpp_des TEXT DEFAULT '',
  total_views int NOT NULL,
  lover TEXT[] NOT NULL,
  total_download int NOT NULL,
  wpp_type VARCHAR(10) NOT NULL,
  createat TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tạo bảng collection
CREATE TABLE collection (
  user_id TEXT PRIMARY KEY REFERENCES accounts(user_id),
  wpp_list INT[]
);

-- -- Tạo bảng albums
-- CREATE TABLE albums (
--   user_id TEXT REFERENCES accounts(user_id),
--   album_id SERIAL PRIMARY KEY,
--   album_name VARCHAR(50),
--   album_avt TEXT,
--   wpps INT[]
-- );

-- Thêm nội dung giả
INSERT INTO accounts (user_id, username, password, email, avatar, display_name, account_type, account_status)
VALUES ('user@1', 'dm410', '123456', 'dm410@gmail.com', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'Dương Minh', 'user', 'normal'),
       ('user@2', 'datchodien', '123456', 'pd2808@gmail.com', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'Phúc Đạt', 'admin', 'normal'),
       ('user@3', 'bluegirl2014', '123456', 'bluegirl2014@gmail.com', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'Nguyễn Ba Phương', 'user', 'normal');

-- Thêm dữ liệu giả vào bảng user_detail
INSERT INTO user_detail (user_id, following, follower, location) VALUES
  ('user@1', ARRAY['user@2', 'user@3'], ARRAY['user@3'], '{"city": "", "country": "Viet Nam"}'::JSONB),
  ('user@2', ARRAY['user@3'], ARRAY['user@1', 'user@3'], '{"city": "Ho Chi Minh", "country": "Viet Nam"}'::JSONB),
  ('user@3', ARRAY[]::TEXT[], ARRAY['user@1', 'user@2'], '{"city": "Hanoi", "country": "Viet Nam"}'::JSONB);
-- Thêm nội dung giả
INSERT INTO wallpapers (user_id, artist_name, artist_img, wpp_path, total_views, lover, total_download, wpp_type, wpp_tags, wpp_des, createat)
VALUES 
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(1).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-09 10:27:47.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(10).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-09 21:12:22.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(11).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 02:45:38.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(12).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-07 22:21:47.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(13).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 12:44:06.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(14).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 11:45:08.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(15).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 16:59:04.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(16).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-06 19:39:12.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(17).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-09 13:09:00.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(18).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 13:11:29.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(19).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-09 07:35:44.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(2).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 18:19:11.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(20).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-06 03:43:12.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(21).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-06 09:38:40.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(22).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-06 02:58:41.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(23).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-07 06:06:33.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(24).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-07 17:23:27.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(25).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 10:53:20.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(26).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-07 09:23:51.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(3).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-07 12:44:03.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(4).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-06 23:47:51.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(6).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 16:46:55.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(7).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 12:41:31.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(8).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 07:58:16.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx(9).jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-07 08:14:28.000000'),
('user@1', 'Dương Minh', 'https://aldortio.sirv.com/swallpapers/user/avt/dm410.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/peakpx.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'GenshinImpact', '', ' 2023-03-08 20:00:57.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/593616.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-08 17:41:28.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/606224.png', 0, ARRAY[]::INT[], 0, 'image/png', 'Anime', '', ' 2023-03-07 12:54:23.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/613926.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-06 10:21:38.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/632075.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-06 08:31:28.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/632918.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-06 12:19:04.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/640956.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-08 14:49:16.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/648557.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-07 08:22:39.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/653529.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-08 06:45:24.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/654247.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-09 13:00:15.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/677543.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-06 05:28:31.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/698363.png', 0, ARRAY[]::INT[], 0, 'image/png', 'Anime', '', ' 2023-03-08 21:00:43.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/699287.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-07 09:24:33.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/709897.png', 0, ARRAY[]::INT[], 0, 'image/png', 'Anime', '', ' 2023-03-08 11:11:18.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/714520.png', 0, ARRAY[]::INT[], 0, 'image/png', 'Anime', '', ' 2023-03-08 21:12:45.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/739671.png', 0, ARRAY[]::INT[], 0, 'image/png', 'Anime', '', ' 2023-03-08 16:09:55.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/744908.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-07 09:48:23.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/819837.png', 0, ARRAY[]::INT[], 0, 'image/png', 'Anime', '', ' 2023-03-06 06:37:25.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/851512.png', 0, ARRAY[]::INT[], 0, 'image/png', 'Anime', '', ' 2023-03-07 19:24:03.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/896653.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-07 12:25:32.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/932487.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-06 17:00:24.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/934905.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-07 05:47:10.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/976013.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-08 19:19:22.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/987919.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-06 20:44:20.000000'),
('user@3', 'Nguyễn Ba Phương', 'https://aldortio.sirv.com/swallpapers/user/avt/bluegirl2014.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/994514.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Anime', '', ' 2023-03-08 18:42:42.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/anders-jilden-AkUR27wtaxs-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 05:42:03.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/anders-jilden-uwbajDCODj4-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-09 23:28:43.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/andre-benz-cXU6tNxhub0-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 18:25:24.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/andrew-neel-jtsW--Z6bFw-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 18:25:31.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/aniket-deole-M6XC789HLe8-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-06 03:15:15.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/benjamin-voros-phIFdC6lA4E-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 17:50:31.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/daniel-leone-v7daTKlZzaw-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 18:49:21.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/emma-francis-vpHCfunwDrQ-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-06 16:09:15.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/fabian-moller-gI7zgb80QWY-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 07:32:19.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/jack-anstey-XVoyX7l9ocY-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 19:57:06.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/jake-weirick-EsvpmQ4zp5Y-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-06 12:22:41.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/jason-wong-KRr9SWTsaxg-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-09 23:23:39.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/jezael-melgoza-2FiXtdnVhjQ-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 02:01:48.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/johannes-plenio-RwHv7LgeC7s-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 11:43:51.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/john-fowler-03Pv2Ikm5Hk-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 09:33:49.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/john-towner-JgOeRuGD_Y4-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-09 12:26:56.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/jonatan-pie-3l3RwQdHRHg-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-06 17:58:44.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/kace-rodriguez-p3OzJuT_Dks-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 23:42:14.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-09 15:47:51.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/keith-wong-O_4BZo5E690-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-06 11:53:44.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/luca-bravo-zAjdgNXsMeg-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 12:30:17.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/mark-basarab-1OtUkD_8svc-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-09 07:09:33.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/matteo-catanese-PI8Hk-3ZcCU-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-09 12:14:40.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/milad-fakurian-wNsHBf_bTBo-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 07:05:42.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/nasa-Q1p7bh3SHj8-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 16:24:06.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/nasa-yZygONrUBe8-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 21:49:10.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/osman-rana-n61ur6rT_F8-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 13:45:52.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/pedro-lastra-Nyvq2juw4_o-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 21:56:59.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/piotr-chrobot-6oUsyeYXgTg-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-06 06:15:30.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/samuel-scrimshaw-sseiVD2XsOk-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-07 18:16:40.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/sebastian-svenson-d2w-_1LJioQ-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-06 04:40:19.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/sebastian-unrau-sp-p7uuT0tw-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-08 18:40:30.000000'),
('user@2', 'Phúc Đạt', 'https://aldortio.sirv.com/swallpapers/user/avt/datchodien.png', 'https://aldortio.sirv.com/swallpapers/wallpapers/william-bout-7cdFZmLlWOM-unsplash.jpg', 0, ARRAY[]::INT[], 0, 'image/jpeg', 'Wallpaper4K', '', ' 2023-03-06 16:16:57.000000');

-- -- Thêm dữ liệu giả vào bảng albums
-- INSERT INTO albums (user_id, album_name, album_avt, wpps) VALUES
--   ('user@1', 'Genshin Impact', 'https://aldortio.sirv.com/swallpapers/albums/avt/wpp(4).jpg', ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]),
--   ('user@1', 'Soul of the wind', 'https://aldortio.sirv.com/swallpapers/albums/avt/wpp(16).jpg', ARRAY[19, 20, 21, 22, 23, 24, 25, 26, 27]),
--   ('user@1', 'Gaming 4K', 'https://aldortio.sirv.com/swallpapers/albums/avt/wpp(15).jpg', ARRAY[]::INT[]);

-- Thêm dữ liệu giả vào bảng collection
INSERT INTO collection (user_id, wpp_list) VALUES
  ('user@1', ARRAY[]::INT[]),
  ('user@2', ARRAY[]::INT[]),
  ('user@3', ARRAY[]::INT[]);

-- Viết function
DROP FUNCTION IF EXISTS get_accounts_by_username(username_in TEXT);
-- Create
CREATE OR REPLACE FUNCTION get_accounts_by_username(username_in TEXT)
RETURNS TABLE (
    user_id TEXT,
    username TEXT,
    password TEXT,
    email TEXT,
    avatar TEXT,
    display_name VARCHAR(50),
    account_type VARCHAR(10),
    account_status VARCHAR(10),
    createat TIMESTAMP,
	following TEXT[],
  	follower TEXT[],
  	location JSONB
) 
AS 
$$
BEGIN
    RETURN QUERY (
		SELECT 
			DISTINCT accounts.user_id, 
			accounts.username,
			accounts.password,
			accounts.email,
			accounts.avatar,
			accounts.display_name,
			accounts.account_type,
			accounts.account_status,
			accounts.createat,
			user_detail.following,
			user_detail.follower,
			user_detail.location
		FROM accounts
		JOIN user_detail ON accounts.user_id = user_detail.user_id
		WHERE accounts.username = username_in
	);
END;
$$ 
LANGUAGE plpgsql;


-- Xem bảng đã được tạo
SELECT * FROM accounts;
SELECT MAX(user_id) as LAST_ID FROM accounts;
-- Call
SELECT username, avatar, display_name, account_type, account_status, createat, following, follower, location
FROM get_accounts_by_username('phucdat4102');
-- Xem bảng đã được tạo
SELECT * FROM user_detail;
-- SELECT * FROM albums;
-- Xem bảng đã được tạo;
SELECT * FROM wallpapers where user_id='user@1' ORDER BY createat desc ;
SELECT * FROM collection;

SELECT user_id, wpp_id, total_download, wpp_path
FROM wallpapers
ORDER BY total_download DESC, wpp_id ASC
OFFSET 30
LIMIT 15; 