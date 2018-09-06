const shim = require("fabric-shim");
const SimpleToken = require("./examples/SimpleToken");

 /**
  * @dev Start chaincode
  */
shim.start(new SimpleToken());
