const shim = require("fabric-shim");
const ERC20 = require("./ERC20");
const Validations = require("../helpers/validations");
const Utils = require("../helpers/utils");

const ClientIdentity = shim.ClientIdentity;

/**
 * @title Ownable token
 * @dev The Ownable token contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
const Ownable = class extends ERC20 {
  /**
   * @dev Get owner Identity for token chaincode.
   */
  async getOwner(stub) {
    let owner = await stub.getState("owner");
    owner = Utils.defaultToUndefinedIfEmpty(owner);
    return owner;
  }

  /**
   * @dev This Function allows the current owner to
   * transfer control of the contract to a newOwner.
   */
  async transferOwnership(stub, args, thisClass) {
    const callerMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(callerMspId);

    const owner = thisClass["getOwner"];
    const tokenOwnerMspId = (await owner(stub)).toString();
    Validations.checkMspId(tokenOwnerMspId);
    Validations.checkCallerIsOwner(callerMspId, tokenOwnerMspId);
    Validations.checkArgsLength(args, 1);

    const [newOwnerMspId] = args;
    Validations.isString(newOwnerMspId);
    Validations.checkMspId(newOwnerMspId);
    const newOwnerBuffer = Utils.toBuffer(newOwnerMspId);

    try {
      await stub.putState("owner", newOwnerBuffer);
    } catch (error) {
      throw new Error(`Failed to update state. Error: ${error}`);
    }
  }
};

module.exports = Ownable;
