

module.exports = function (deployer, network, accounts) {

  if (network === 'extdev_plasma_us1') {

  	const YatzyCoinPlasma = artifacts.require("YatzyCoinPlasma");
	const extdevGatewayAddress = '0xe754d9518bf4a9c63476891ef9AA7d91C8236A5D';
  	deployer.then(async () => {
		await deployer.deploy(YatzyCoinPlasma, extdevGatewayAddress);
		const yatzyCoinPlasma = await YatzyCoinPlasma.deployed();

		console.log('\n*************************************************************************\n')
		console.log(`YatzyCoin DappChain Contract Address: ${yatzyCoinPlasma.address}`)
		console.log('\n*************************************************************************\n')
  	});

  } else {

  	const YatzyCoin = artifacts.require("YatzyCoin");
  	deployer.then(async () => {
	    await deployer.deploy(YatzyCoin);
	    const yatzyCoin = await YatzyCoin.deployed();
	        
	    console.log('\n*************************************************************************\n')
	    console.log(`YatzyCoin Ethereum Contract Address: ${yatzyCoin.address}`)
	    console.log('\n*************************************************************************\n')
  	})
  }

}