$start = <<SCRIPT
docker start mongo
docker start log-fluentd
docker start node-server
docker start mongo-express
SCRIPT

Vagrant.configure(2) do |config|
	config.vm.provider "virtualbox"
	config.vm.box = "ubuntu/trusty64"

	config.vm.network "forwarded_port", guest: 8080, host: 18080
	config.vm.network "forwarded_port", guest: 8081, host: 18081
	config.vm.network "forwarded_port", guest: 27017, host: 17017

	config.vm.network "private_network", ip: "192.168.210.2"
	config.vm.synced_folder ".", "/app", type: "nfs"

	config.vm.provider :virtualbox do |v|
		v.customize ["guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 10000]
  end
	config.vm.provision "docker" do |d|
		d.build_image "/app/docker/base",
			args: "-t mylibrary/base"
		d.build_image "/app/docker/data",
			args: "-t mylibrary/data"
		d.build_image "/app/docker/app/MongoDB",
				args: "-t mylibrary/mongo"
		d.build_image "/app/docker/servers/NodeJS",
			args: "-t mylibrary-server/node"
		d.build_image "/app/docker/log/Fluentd",
				args: "-t mylibrary-log/fluentd"
		d.build_image "/app/docker/app/Node-Server",
			args: "-t mylibrary/node-server"
		d.build_image "/app/docker/test/data/Mongo-Express",
			args: "-t mylibrary/mongo-express"

		d.run "data",
			image: "mylibrary/data",
			args: "-v /app:/app"
		d.run "mongo",
			image: "mylibrary/mongo",
			args: "-p 27017:27017 --volumes-from data"
		d.run "log-fluentd",
				image: "mylibrary-log/fluentd",
				args: "--volumes-from data"
		d.run "node-server",
			image: "mylibrary/node-server",
			args: "-p 8080:8080 --link mongo:mongo --link log-fluentd:fluentd --volumes-from data"
		d.run "mongo-express",
			image: "mylibrary/mongo-express",
			args: "-p 8081:8081 --link mongo:mongo"
	end

	config.vm.provision "shell", run: "always", inline: $start
end
