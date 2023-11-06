cd /srv

git clone https://github.com/zhengdechang/elemusic.git

cd elemusic

git submodule update --init --recursive

docker-compose up --build