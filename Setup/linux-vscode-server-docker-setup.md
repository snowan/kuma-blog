## How to set up remote 


#### Common issues when run bash script
1. If you run into bash script permission denied on Linux, run below command
`chmod +x <your bash script>` 

For example, code server script:
`chmod +x ./run-code-server.sh`

2. If you see below errors
```
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Post http://%2Fvar%2Frun%2Fdocker.sock/v1.40/containers/create?name=code-server: dial unix /var/run/docker.sock: connect: permission denied
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Post http://%2Fvar%2Frun%2Fdocker.sock/v1.40/containers/code-server/start: dial unix /var/run/docker.sock: connect: permission denied
```

**Solution is to run**
`sudo chmod 666 /var/run/docker.sock`

- For more details refer to offical Docker docs [here](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)
