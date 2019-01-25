// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require("truffle-hdwallet-provider");
// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
   },
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: new HDWalletProvider("prevent cancel north novel security scout rain fitness genuine news cricket thing", "https://rinkeby.infura.io/v3/e2945385d67d4fabbff9faa20cc1b713")
        ,
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000
    }
  }
}
