sudo cd /srv

sudo git clone https://github.com/zhengdechang/elemusic.git

sudo cd elemusic

sudo git submodule update --init --recursive

sudo docker-compose up --build