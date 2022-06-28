var CryptoKoffee = artifacts.require("./CryptoKoffee.sol");

module.exports = function(deployer) {
  deployer.deploy(CryptoKoffee);
};
