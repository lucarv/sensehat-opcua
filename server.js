require('dotenv').config();
var host = process.env.HOST;
var port = process.env.PORT;
var resourcePath = process.env.RESOURCEPATH;

console.log('...........................................');
console.log("..       Initializing SENSEHAT IMU       ..");
const imu = require("node-sense-hat").Imu;
console.log('...........................................\n');
const IMU = new imu.IMU();
const os = require('os')
const opcua = require("node-opcua");
const tags = require('./tags.json');
const hostname = os.hostname();

var senseData = {};

const getSensorData = async () => {
  IMU.getValue((err, data) => {
    if (err !== null) {
      console.error("Could not read sensor data: ", err);
    } else {
      senseData = data;
    }
  });
}

setInterval(getSensorData, 1000);

console.log('\n.............................................');
console.log("..       Initializing OPC-UA server        ..");
console.log('.............................................');
const server = new opcua.OPCUAServer({
  alternateHostname: host,
  port: port, // the port of the listening socket of the server
  resourcePath: resourcePath, // this path will be added to the endpoint resource name
  buildInfo: {
    productName: "NODE-OPCUA server",
    buildNumber: "0001",
    buildDate: new Date(2020, 10, 20)
  }
});

const addTags = () => {
  console.log('\n.............................................')
  console.log('..               Adding TAGS               ..')
  console.log('.............................................')
  const device = namespace.addFolder("ObjectsFolder", {
    browseName: "RaspberryPi with SenseHat"
  });

  for (var i = 0; i < tags.length; i++) {
    let nodeId = tags[i].nodeId;
    let browseName = hostname +'.'+tags[i].browseName;
    let dataType = tags[i].dataType;
    let func = tags[i].func;
    let seed = 0
    if (tags[i].hasOwnProperty(seed))
      seed = tags[i].seed
    let value = 0;
    console.log(`${nodeId}: ${browseName}`)

    namespace.addVariable({
      componentOf: device,
      nodeId: nodeId,
      browseName: browseName,
      dataType: dataType,
      value: {
        get: function () {


          var idx = tags.findIndex(i => i.nodeId === nodeId);
          var dataType = tags[idx].dataType;
          if (senseData.hasOwnProperty(tags[idx].browseName)) {
            let value = eval(tags[idx].func);
            console.log('........................................');
            console.log(`${tags[idx].nodeId} => ${value}`);
          } else {
            value = false,
            dataType = "Boolean"
          }
          return new opcua.Variant({
            dataType: dataType,
            value: value
          });
        }
      }
    });
  }
  console.log('.............................................')
}

const construct_my_address_space = () => {
  addressSpace = server.engine.addressSpace;
  namespace = addressSpace.getOwnNamespace();
  console.log(`ApplicationUri: ${namespace.namespaceUri}`);
}

const g = () => {
  const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
  console.log('\n.............................................');
  console.log(`Server started( press CTRL+C to stop)`);
  console.log(`   ${endpointUrl}`);
  console.log('.............................................\n');

  let UAObject = addressSpace.rootFolder
  //console.log(UAObject.browseName)
  //console.log(UAObject.objects.browseName)

}

server.initialize(() => {
  construct_my_address_space();
  addTags();
  server.start(g)
});
