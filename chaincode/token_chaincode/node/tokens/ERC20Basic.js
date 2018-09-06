const shim = require("fabric-shim");
const Validations = require("../helpers/validations");
const Utils = require("../helpers/utils");

const ClientIdentity = shim.ClientIdentity;

/**
 * @title Basic ERC20 token
 *
 * @dev Implementation of the basic ERC20 token features.
 */
const ERC20Basic = class {
  /**
   * @dev Gets the balance of the specified identity.
   */
  async getBalanceOf(stub, args) {
    Validations.checkArgsLength(args, 1);
    Validations.checkMspId(args[0]);

    let tokenBalance = await stub.getState(args[0]);
    tokenBalance = Utils.defaultToZeroIfEmpty(tokenBalance);
    return tokenBalance;
  }

  /**
   * @dev Get total number of tokens in existence.
   */
  async getTotalSupply(stub) {
    let totalSupply = await stub.getState("totalSupply");
    totalSupply = Utils.defaultToZeroIfEmpty(totalSupply);
    return totalSupply;
  }

  /**
   * @dev Function to transfer token for a specified address.
   */
  async transfer(stub, args, thisClass) {
    Validations.checkArgsLength(args, 2);

    let [receiverMspId, value] = args;
    Validations.isString(receiverMspId);
    Validations.isString(value);
    Validations.checkMspId(receiverMspId);
    Validations.isGreaterThanZero(value);

    const senderMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(senderMspId);
    value = parseFloat(value);

    const balanceOf = thisClass["getBalanceOf"];
    const balancePromises = [
      balanceOf(stub, [senderMspId]),
      balanceOf(stub, [receiverMspId])
    ];
    const balances = await Promise.all(balancePromises);
    const [balanceOfSender, balanceOfReceiver] = balances.map(buffer =>
      Utils.bufferToFloat(buffer)
    );

    Validations.checkBalance(balanceOfSender, senderMspId);
    Validations.checkBalance(balanceOfReceiver, receiverMspId);
    Validations.isSmallerOrEqual(value, balanceOfSender);

    const newSenderBalance = Utils.toBuffer(balanceOfSender - value);
    const newReceiverBalance = Utils.toBuffer(balanceOfReceiver + value);
    try {
      await stub.putState(senderMspId, newSenderBalance);
      await stub.putState(receiverMspId, newReceiverBalance);
    } catch (error) {
      throw new Error(`Failed to update state. Error: ${error}`);
    }
  }
};

module.exports = ERC20Basic;
