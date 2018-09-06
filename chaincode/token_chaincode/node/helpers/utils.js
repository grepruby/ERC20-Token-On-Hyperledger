const Utils = class {
  static defaultToZeroIfEmpty(value) {
    if (value.toString() === "") {
      console.log("Defaulting to zero.");

      return Buffer.from("0");
    }
    return value;
  }

  static defaultToUndefinedIfEmpty(value) {
    if (value.toString() === "") {
      console.log("Defaulting to undefined.");

      return Buffer.from("undefined");
    }
    return value;
  }

  static bufferToFloat(buffer) {
    try {
      const response = parseFloat(buffer.toString());
      return response;
    } catch (error) {
      throw new Error(`Error parsing value to float: ${buffer.toString()}.`);
    }
  }

  static toBuffer(value) {
    return Buffer.from(value.toString());
  }

  static async processBalance(promise) {
    const balance = await promise;
    return parseFloat(balance.toString());
  }
};

module.exports = Utils;
