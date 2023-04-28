const TransplantContract = artifacts.require("TransplantContract");

module.exports = function (deployer) {
  deployer.deploy(TransplantContract);
};