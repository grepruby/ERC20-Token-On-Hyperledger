const shim = require("fabric-shim");
const ERC20Basic = require("./ERC20Basic");
const Validations = require("../helpers/validations");
const Utils = require("../helpers/utils");

const ClientIdentity = shim.ClientIdentity;

/**
 * @title ERC20 token
 *
 * @dev Implementation of the advanced ERC20 token features.
 */
const ERC20 = class extends ERC20Basic {
  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   */
  async getAllowance(stub, args) {
    Validations.checkArgsLength(args, 2);
    const [owner, spender] = args;
    Validations.isString(owner);
    Validations.isString(spender);
    Validations.checkMspId(owner);
    Validations.checkMspId(spender);

    let allowance = await stub.getState(`${owner}-${spender}`);
    allowance = Utils.defaultToZeroIfEmpty(allowance);

    return allowance;
  }

  /**
   * @dev Approve the passed identity to spend the specified amount
   * of tokens on behalf of the function caller.
   */
  async transferFrom(stub, args, thisClass) {
    Validations.checkArgsLength(args, 3);

    let [tokenOwnerMspId, receiverMspId, value] = args;
    Validations.isString(tokenOwnerMspId);
    Validations.isString(receiverMspId);
    Validations.isString(value);
    Validations.checkMspId(tokenOwnerMspId);
    Validations.checkMspId(receiverMspId);
    Validations.isGreaterThanZero(value);

    const spenderMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(spenderMspId);
    value = parseFloat(value);

    const balanceOf = thisClass["getBalanceOf"];
    const allowance = thisClass["getAllowance"];
    const promises = [
      balanceOf(stub, [tokenOwnerMspId]),
      balanceOf(stub, [receiverMspId]),
      allowance(stub, [tokenOwnerMspId, spenderMspId])
    ];
    const buffers = await Promise.all(promises);
    const [
      balanceOfTokenOwner,
      balanceOfReceiver,
      approvedAmount
    ] = buffers.map(buffer => Utils.bufferToFloat(buffer));

    Validations.checkBalance(balanceOfTokenOwner, tokenOwnerMspId);
    Validations.checkBalance(balanceOfReceiver, receiverMspId);
    Validations.checkApproved(
      approvedAmount,
      `${tokenOwnerMspId}-${spenderMspId}`
    );
    Validations.isSmallerOrEqual(value, balanceOfTokenOwner);
    Validations.isSmallerOrEqual(value, approvedAmount);

    const newOwnerBalance = Utils.toBuffer(balanceOfTokenOwner - value);
    const newReceiverBalance = Utils.toBuffer(balanceOfReceiver + value);
    const newAllowance = Utils.toBuffer(approvedAmount - value);

    try {
      await stub.putState(tokenOwnerMspId, newOwnerBalance);
      await stub.putState(`${tokenOwnerMspId}-${spenderMspId}`, newAllowance);
      await stub.putState(receiverMspId, newReceiverBalance);
    } catch (error) {
      throw new Error(`Failed to update state. Error: ${error}`);
    }
  }

  /**
   * @dev Approve the passed identity to spend the specified
   * amount of tokens on behalf of the function caller.
   */
  async updateApproval(stub, args) {
    Validations.checkArgsLength(args, 2);

    const [spenderMspId, value] = args;
    Validations.isString(spenderMspId);
    Validations.isString(value);
    Validations.checkMspId(spenderMspId);
    Validations.isGreaterThanZero(value);

    const callerMspId = new ClientIdentity(stub).getMSPID();
    Validations.checkMspId(callerMspId);
    const newAllowance = Utils.toBuffer(value);

    try {
      await stub.putState(`${callerMspId}-${spenderMspId}`, newAllowance);
    } catch (error) {
      throw new Error(`Failed to update state. Error: ${error}`);
    }
  }
};

module.exports = ERC20;
