const shim = require("fabric-shim");
const MintableToken = require("./MintableToken");
const Validations = require("../helpers/validations");
const Utils = require("../helpers/utils");

const ClientIdentity = shim.ClientIdentity;

/**
 * @title ERC20Detailed token
 * @dev The decimals are only for visualization purposes.
 * All the operations are done using the smallest and indivisible token unit.
 */
class ERC20Detailed extends MintableToken {
  /**
   * @dev Get name of token.
   */
  async getName(stub) {
    let name = await stub.getState("name");
    name = Utils.defaultToUndefinedIfEmpty(name);
    return name;
  }

  /**
   * @dev Get symbol of token.
   */
  async getSymbol(stub) {
    let symbol = await stub.getState("symbol");
    symbol = Utils.defaultToUndefinedIfEmpty(symbol);
    return symbol;
  }

  /**
   * @dev Function to update token symbol.
   */
  async updateTokenSymbol(stub, args, thisClass) {
    const callerMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(callerMspId);

    const owner = thisClass["getOwner"];
    const tokenOwnerMspId = (await owner(stub)).toString();
    Validations.checkMspId(tokenOwnerMspId);
    Validations.checkCallerIsOwner(callerMspId, tokenOwnerMspId);
    Validations.checkArgsLength(args, 1);
    const [newTokenSymbol] = args;
    Validations.isString(newTokenSymbol);
    const tokenSymbolBuffer = Utils.toBuffer(newTokenSymbol);

    try {
      await stub.putState("symbol", tokenSymbolBuffer);
    } catch (error) {
      throw new Error(`Failed to update state. Error: ${error}`);
    }
  }

  /**
   * @dev Function to update token name.
   */
  async updateTokenName(stub, args, thisClass) {
    const callerMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(callerMspId);

    const owner = thisClass["getOwner"];
    const tokenOwnerMspId = (await owner(stub)).toString();
    Validations.checkMspId(tokenOwnerMspId);
    Validations.checkCallerIsOwner(callerMspId, tokenOwnerMspId);
    Validations.checkArgsLength(args, 1);
    const [newTokenName] = args;
    Validations.isString(newTokenName);
    const tokenNameBuffer = Utils.toBuffer(newTokenName);

    try {
      await stub.putState("name", tokenNameBuffer);
    } catch (error) {
      throw new Error(`Failed to update state. Error: ${error}`);
    }
  }
}

module.exports = ERC20Detailed;
