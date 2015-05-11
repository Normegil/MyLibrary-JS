$start = <<SCRIPT
docker start data
docker start mongo
docker start mongo-express
docker start node-server
SCRIPT

Vagrant.configure(2) do |config|
	config.vm.provider "virtualbox"
	config.vm.box = "ubuntu/trusty64"

	config.vm.network "forwarded_port", guest: 8080, host: 18080
	config.vm.network "forwarded_port", guest: 8081, host: 18081
	config.vm.network "forwarded_port", guest: 27017, host: 17017

	config.vm.network "private_network", ip: "192.168.210.2"
	config.vm.synced_folder ".", "/app", type: "nfs"

	config.vm.provision "docker" do |d|
		d.build_image "/app/docker/Data-Only",
			args: "-t mylibrary/data"
		d.build_image "/app/docker/MongoDB",
			args: "-t mylibrary/mongo"
		d.build_image "/app/docker/NodeJS",
			args: "-t mylibrary/node"
		d.build_image "/app/docker/Mongo-Express",
			args: "-t mylibrary/mongo-express"
		d.build_image "/app/docker/Node-Server",
			args: "-t mylibrary/node-server"

		d.run "data",
			image: "mylibrary/data",
			args: "-v /app:/app"
		d.run "mongo",
			image: "mylibrary/mongo",
			args: "-p 27017:27017 --volumes-from data"
		d.run "mongo-express",
			image: "mylibrary/mongo-express",
			args: "-p 8081:8081 --link mongo:mongo --volumes-from data"
		d.run "node-server",
			image: "mylibrary/node-server",
			args: "-p 8080:8080 --link mongo:mongo --volumes-from data"
	end

	config.vm.provision "shell", run: "always", inline: $start
end
