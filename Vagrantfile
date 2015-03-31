$setup = <<SCRIPT
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

docker build -t mongo /app/docker/MongoDB/
docker build -t node /app/docker/NodeJS/

docker run -d -p 27017:27017 --name mongo mongo:latest
docker run -d -p 8080:8080 --name node node:latest
SCRIPT

$start = <<SCRIPT
docker start mongo
docker start node
SCRIPT

Vagrant.configure(2) do |config|
	config.vm.provider "virtualbox"
	config.vm.box = "ubuntu/trusty64"

	config.vm.network "forwarded_port", guest: 8080, host: 18080
	config.vm.network "forwarded_port", guest: 27017, host: 17017

	config.vm.provision "docker"

	config.vm.network "private_network", ip: "192.168.210.2"
	config.vm.synced_folder ".", "/app", type: "nfs"

	config.vm.provision "shell", inline: $setup

	config.vm.provision "shell", run: "always", inline: $start
end
