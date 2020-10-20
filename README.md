# PLC SIMULATOR

Based on [node-opcua](http://node-opcua.github.io/) all kudos due

This script will let you simulate a PLC by entering tags on the tags.json file.
```
[
    {
        "nodeId": "s=010",
        "browseName": "your tag name",
        "dataType": "Int32", // any valid OPC-UA data type
        "func": "seed + 1", // a string containing a function that will generate the nodeId value
        "seed": 100 // a seed to the function 'func' above
    }
    ...
]
```

## Get started (local deployement) 
1. clone
2. set three env vars, one called HOSTNAME (set it to your OPC-UA IP or FQDN), one called PORT (the port you want your OPC-UA clients to connect) and one for your OPC UA resource path called RESOURCEPATH (e.g /myRA)
3. edit the tags.json
4. start the script (DEBUG=* if you want to see what the server is doing)

## Run as a container image
1. clone
2. build
3. docker run -p<host port>:<container port> -e hostname=<your hostname> -e port=<container port> -e <your resource path> lucarv.azurecr.io/simple_opcua_server

## Set it as a container instance on Azure 
1. Use the Dockerfile in this repo to create your image  
2. Push it to Azure  
3. Create one (or more) Container Instances (below is an example)

```
az container create --resource-group YOUR_RG_NAME ddmstatusapp --image YOUR_IMAGE_LOCATION_IN_ITS_REGISTRY --cpu 1 --memory 1 --registry-login-server YOUR_REGISTRY_URL --registry-username YOUR_REGISTRY_USERNAME --registry-password YOUR_REGISTRY_PASSWORD --dns-name-label A_LABEL_FOR_DNS --environmental-variables HOSTNAME=THE_DNS_LABEL_YOU_CHOSE.azurecontainer.io RESOURCEPATH=A_FOLDER_FOR_YOUR_TAGS

e.g. az container create --resource-group lucaRG ddmstatusapp --image lucarv.azurecr.io/simple_opcua_server --cpu 1 --memory 1 --registry-login-server lucarv.azurecr.io --registry-username lucarv --registry-password {this is a password but not the real one} --dns-name-label luca-opcua-sim --environmental-variables HOSTNAME=luca-opcua-sim.azurecontainer.io RESOURCEPATH=/lucaPLC
 
```
### Extra note
if you want to change the tags.json without having to rebuild the image, you can mount an external volume when creating the container instance like shown [here](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files)# sensehat-opcua
