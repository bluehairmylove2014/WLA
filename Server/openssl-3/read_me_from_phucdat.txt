Mở command line rồi vào folder x64\bin chạy các lệnh sau để tạo provite key, public key:

– Tạo private key:
openssl genrsa -out private-key.txt

– Tạo public key:
openssl rsa -in private-key.txt -pubout -out public-key.txt

Chép 2 file mới tạo private-key.txt và public-key.txt sang folder chính của server để dùng