-- Xóa bảng user_detail nếu đã tồn tại
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS user_detail;
DROP TABLE IF EXISTS wallpapers;
DROP TABLE IF EXISTS accounts;

-- Tạo bảng account
CREATE TABLE accounts (
  user_id TEXT PRIMARY KEY NOT NULL,
  username VARCHAR(16) NOT NULL,
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
  total_views int NOT NULL,
  total_love int NOT NULL,
  total_download int NOT NULL,
  wpp_type VARCHAR(10) NOT NULL
);

-- Tạo bảng albums
CREATE TABLE albums (
  user_id TEXT REFERENCES accounts(user_id),
  album_id SERIAL PRIMARY KEY,
  album_name VARCHAR(50),
  album_avt TEXT,
  wpps INT[]
);

-- Viết function
DROP FUNCTION get_accounts_by_username(username_in VARCHAR(16));
-- Create
CREATE OR REPLACE FUNCTION get_accounts_by_username(username_in VARCHAR(16))
RETURNS TABLE (
    user_id TEXT,
    username VARCHAR(16),
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


-- Thêm nội dung giả
INSERT INTO accounts (user_id, username, password, email, avatar, display_name, account_type, account_status)
VALUES ('user@1', 'dm410', '123456', 'dm410@gmail.com', '../../assets/user/avt/dm410.png', 'Dương Minh', 'user', 'normal'),
       ('user@2', 'datchodien', '123456', 'pd2808@gmail.com', '../../assets/user/avt/datchodien.png', 'Phúc Đạt', 'admin', 'normal'),
       ('user@3', 'bluegirl2014', '123456', 'bluegirl2014@gmail.com', '../../assets/user/avt/bluegirl2014.png', 'Nguyễn Ba Phương', 'user', 'normal');

-- Thêm dữ liệu giả vào bảng user_detail
INSERT INTO user_detail (user_id, following, follower, location) VALUES
  ('user@1', ARRAY['user@2', 'user@3'], ARRAY['user@3'], '{"city": "", "country": "Viet Nam"}'::JSONB),
  ('user@2', ARRAY['user@3'], ARRAY['user@1', 'user@3'], '{"city": "Ho Chi Minh", "country": "Viet Nam"}'::JSONB),
  ('user@3', ARRAY[]::TEXT[], ARRAY['user@1', 'user@2'], '{"city": "Hanoi", "country": "Viet Nam"}'::JSONB);
-- Thêm nội dung giả
INSERT INTO wallpapers (user_id, artist_name, artist_img, wpp_path, total_views, total_love, total_download, wpp_type)
VALUES ('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/phoenix_ayaka.png', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(1).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(2).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(3).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(4).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(5).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(6).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(7).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(8).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(9).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(10).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(11).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(12).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(13).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(14).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(15).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(16).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/wpp(17).jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-tan-danh-1329711.jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-simon-berger-1323550.jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-roberto-nickson-2559941.jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-roberto-nickson-2478248.jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-rakicevic-nenad-769525.jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-pixabay-461940.jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-og-mpango-3041110.jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-maxime-francis-2246476.jpg', 0, 0, 0, 'image'),
('user@1', 'Dương Minh', '../../assets/user/avt/dm410.png', '../../assets/wallpapers/pexels-luis-del-río-15286.jpg', 0, 0, 0, 'image'),
('user@3', 'Nguyễn Ba Phương', '../../assets/user/avt/bluegirl2014.png', '../../assets/wallpapers/pexels-irina-iriser-1408221.jpg', 0, 0, 0, 'image'),
('user@3', 'Nguyễn Ba Phương', '../../assets/user/avt/bluegirl2014.png', '../../assets/wallpapers/pexels-luis-del-río-15286.jpg', 0, 0, 0, 'image'),
('user@3', 'Nguyễn Ba Phương', '../../assets/user/avt/bluegirl2014.png', '../../assets/wallpapers/pexels-maxime-francis-2246476.jpg', 0, 0, 0, 'image'),
('user@3', 'Nguyễn Ba Phương', '../../assets/user/avt/bluegirl2014.png', '../../assets/wallpapers/pexels-og-mpango-3041110.jpg', 0, 0, 0, 'image'),
('user@3', 'Nguyễn Ba Phương', '../../assets/user/avt/bluegirl2014.png', '../../assets/wallpapers/pexels-pixabay-461940.jpg', 0, 0, 0, 'image'),
('user@3', 'Nguyễn Ba Phương', '../../assets/user/avt/bluegirl2014.png', '../../assets/wallpapers/pexels-rakicevic-nenad-769525.jpg', 0, 0, 0, 'image'),
('user@3', 'Nguyễn Ba Phương', '../../assets/user/avt/bluegirl2014.png', '../../assets/wallpapers/pexels-roberto-nickson-2478248.jpg', 0, 0, 0, 'image'),
('user@3', 'Nguyễn Ba Phương', '../../assets/user/avt/bluegirl2014.png', '../../assets/wallpapers/pexels-roberto-nickson-2559941.jpg', 0, 0, 0, 'image');

-- Thêm dữ liệu giả vào bảng albums
INSERT INTO albums (user_id, album_name, album_avt, wpps) VALUES
  ('user@1', 'Genshin Impact', '../../assets/albums/phoenix_ayaka.png', ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]),
  ('user@1', 'Soul of the wind', '../../assets/albums/avt/wpp(16).jpg', ARRAY[19, 20, 21, 22, 23, 24, 25, 26, 27]),
  ('user@1', 'Gaming 4K', '../../assets/albums/avt/wpp(15).jpg', ARRAY[]::INT[]);

-- Xem bảng đã được tạo
SELECT * FROM accounts;
-- Call
SELECT * FROM get_accounts_by_username('dm410');
-- Xem bảng đã được tạo
SELECT * FROM user_detail;
-- Xem bảng đã được tạo
SELECT * FROM wallpapers ORDER BY wpp_id ASC;