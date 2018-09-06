const shim = require("fabric-shim");
const OwnableToken = require("./OwnableToken");
const Validations = require("../helpers/validations");
const Utils = require("../helpers/utils");

const ClientIdentity = shim.ClientIdentity;

/**
 * @title Mintable token
 * @dev Simple ERC20 Token example, with mintable token creation
 */
const MintableToken = class extends OwnableToken {
  /**
   * @dev Whether minting is allowed or not
   */
  async isMintingAllowed(stub) {
    let _isMintingAllowed = await stub.getState("isMintingAllowed");
    _isMintingAllowed = Utils.defaultToUndefinedIfEmpty(_isMintingAllowed);
    return _isMintingAllowed;
  }

  /**
   * @dev Function to Update MintingState
   */
  async updateMintingState(stub, args, thisClass) {
    const callerMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(callerMspId);

    const owner = thisClass["getOwner"];
    const tokenOwnerMspId = (await owner(stub)).toString();
    Validations.checkMspId(tokenOwnerMspId);
    Validations.checkCallerIsOwner(callerMspId, tokenOwnerMspId);

    Validations.checkArgsLength(args, 1);
    const [bool] = args;
    Validations.isString(bool);
    Validations.isTrueOrFalse(bool);
    const newMintingState = Utils.toBuffer(bool);

    try {
      await stub.putState("isMintingAllowed", newMintingState);
    } catch (error) {
      throw new Error(`Failed to update state. Error: ${error}`);
    }
  }

  /**
   * @dev Function to mint tokens
   */
  async mint(stub, args, thisClass) {
    const isMintingAllowed = thisClass["isMintingAllowed"];
    const _isMintingAllowed = (await isMintingAllowed(stub)).toString();
    Validations.isMintingTrue(_isMintingAllowed);

    const callerMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(callerMspId);

    const owner = thisClass["getOwner"];
    const tokenOwnerMspId = (await owner(stub)).toString();
    Validations.checkMspId(tokenOwnerMspId);
    Validations.checkCallerIsOwner(callerMspId, tokenOwnerMspId);
    Validations.checkArgsLength(args, 2);

    let [toMspId, value] = args;
    Validations.isString(toMspId);
    Validations.checkMspId(toMspId);
    Validations.isString(value);
    Validations.isGreaterThanZero(value);
    value = parseFloat(value);

    const balanceOf = thisClass["getBalanceOf"];
    const totalSupply = thisClass["getTotalSupply"];
    const promises = [balanceOf(stub, [toMspId]), totalSupply(stub)];
    const buffers = await Promise.all(promises);
    const [balanceOfTo, _totalSupply] = buffers.map(buffer =>
      Utils.bufferToFloat(buffer)
    );

    Validations.checkBalance(balanceOfTo);
    Validations.checkTotalSupply(_totalSupply);

    const newTotalSupply = Utils.toBuffer(_totalSupply + value);
    const newBalance = Utils.toBuffer(balanceOfTo + value);

    try {
      await stub.putState("totalSupply", newTotalSupply);
      await stub.putState(toMspId, newBalance);
    } catch (error) {
      throw new Error(`Failed to update state. Error: ${error}`);
    }
  }
};

module.exports = MintableToken;
