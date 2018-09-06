const Validations = class {
  static checkArgsLength(args, expectedLength) {
    if (args.length !== expectedLength) {
      _throw(
        `Invalid number of arguments. Expected ${expectedLength}, got ${
          args.length
        }.`
      );
    }
  }

  static isString(arg) {
    if (typeof arg !== "string") {
      _throw(`Invalid argument type. Expected string, got ${typeof arg}.`);
    }
  }

  static checkMspId(mspId) {
    if (!mspId || typeof mspId !== "string" || !mspId.endsWith("MSP")) {
      _throw(`Invalid MSPID: ${mspId}, of type: ${typeof mspId}.`);
    }
  }

  static isGreaterThanZero(value) {
    if (parseFloat(value) <= 0) {
      _throw(`Parsed version of ${value}, should be > 0.`);
    }
  }

  static checkBalance(balance, mspId) {
    if (!balance && balance != 0) {
      _throw(`Failed to get balance for sender: ${mspId}.`);
    }
  }

  static checkApproved(approved, key) {
    if (!approved && approved != 0) {
      _throw(`Failed to get approved amount for: ${key}.`);
    }
  }

  static checkTotalSupply(totalSupply) {
    if (!totalSupply && totalSupply != 0) {
      _throw("Failed to get TotalSupply.");
    }
  }

  static isSmallerOrEqual(a, b) {
    if (a > b) {
      _throw(`${a} should be <= to ${b}.`);
    }
  }

  static isTrueOrFalse(arg) {
    if (arg !== "true" && arg !== "false") {
      _throw(`${arg} should equal 'true' or 'false'.`);
    }
  }

  static checkCallerIsOwner(caller, owner) {
    if (caller !== owner) {
      _throw(`Function only accessible to token owner: ${owner}.`);
    }
  }

  static isMintingTrue(mintingAllowed) {
    if (mintingAllowed !== "true") {
      _throw("Minting is not Allowed");
    }
  }
};

const _throw = msg => {
  throw new Error(msg);
};

module.exports = Validations;
