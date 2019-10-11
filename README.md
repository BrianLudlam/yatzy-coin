# Yatzy Coin

Yatzy Coin is a smart contract implementation extending ERC20 and ERC223 Ethereum Token standards, as well as PlasmaChain gateway standard. Coins can be transfered to and from the Plasma Gateway, to be usable/spendable on the Loom sidechain. 

## Deployment

The YatzyCoin contract is to be deployed on Ethereum mainnet or testnet, and the YatzyCoinPlasma contract to be deployed on Loom sidechain. Follow functions gateway-cli.js for base interaction between main and side chains. 

Run `truffle compile` to compile, `truffle deploy` to deploy (default local chain).

## Testing 

Run `truffle test` (test/coinTest.js) for thorough testing.

## Rinkeby Deployed YatzyCoin Contract Address

0xe75eB9FAD63422283f0759230B1AE635efeC101e

## extdev-plasma-us1 Deployed YatzyCoinPlasma Contract Address

0x6aF05d36142C0d9c6B246E38389d28C96711E153