const shim = require("fabric-shim");
const ERC20Detailed = require("../tokens/ERC20Detailed");
const Validations = require("../helpers/validations");
const Utils = require("../helpers/utils");

const ClientIdentity = shim.ClientIdentity;

/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, created in classical style used during ICOs.
 * Tokens can be minted by token owner (functionalities available using Ownable and Mintable),
 * and later they can be distributed using `transfer` and other `ERC20` functions.
 */
class SimpleToken extends ERC20Detailed {
  /** 
   * @dev Init chaincode for Token, this method is called when we
   * instantiate our token.
   * @note It is compulsary to pass init config object, while
   * calling this method. It encapsulates the logic needed for proper working 
   * of other ERC20 token files. Owner of the token is also initialized here
   */
  async Init(stub) {
    console.log("========= Token chaincode Init =========");
    const ret = stub.getFunctionAndParameters();
    const args = ret.params;

    Validations.checkArgsLength(args, 1);
    const coinConfigString = args[0];
    Validations.isString(coinConfigString);

    let coinConfig;
    try {
      coinConfig = JSON.parse(coinConfigString);
    } catch (error) {
      return shim.error(
        `Error while trying to parse string: ${coinConfigString}`
      );
    }

    const ownerMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(ownerMspId);

    const bufferedOwner = Utils.toBuffer(ownerMspId);
    const bufferedName = Utils.toBuffer(coinConfig.name);
    const bufferedSymbol = Utils.toBuffer(coinConfig.symbol);

    try {
      await stub.putState("owner", bufferedOwner);
      await stub.putState("name", bufferedName);
      await stub.putState("symbol", bufferedSymbol);
      return shim.success();
    } catch (error) {
      return shim.error(error);
    }
  }

  /**
   * @dev Invoke Token Chaincode
   */
  async Invoke(stub) {
    console.log("========= Token chaincode Invoke =========");
    const ret = stub.getFunctionAndParameters();

    const method = this[ret.fcn];
    if (!method) {
      console.error(`No method of name: ${ret.fcn} found`);
      return shim.error();
    }
    console.log(`========= Calling Function ${ret.fcn} =========`);

    try {
      const payload = await method(stub, ret.params, this);
      return shim.success(payload);
    } catch (error) {
      console.error(error);
      return shim.error(error);
    }
  }
}

module.exports = SimpleToken;
