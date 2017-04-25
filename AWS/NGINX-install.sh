# todo

# update pkg list
sudo apt-get --assume-yes update

# install git
sudo apt-get --assume-yes install git

# checkout code
# git clone https://github.com/agouaillard/Large-Long-Lived-Connections-Challenge.git

# install NGINX
sudo apt-get --assume-yes install Nginx

# override NGINX config before starting it
sudo cp /home/ubuntu/Large-LongLived-Connections-Challenge/nginx.conf /etc/nginx/nginx.conf
sudo /etc/init.d/nginx start

# set up cron table to make sure nginx is started on restart from now on

# install node and packages
sudo apt-get install -y nodejs

