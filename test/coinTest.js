const truffleAssert = require('truffle-assertions');
const YatzyCoin = artifacts.require("YatzyCoin");

const NAME = "YatzyCoin";
const SYMBOL = "YATZ";
const INITIAL_SUPPLY = 1000000000;
const MINT_AMOUNT = 1000000;
const TRANSFER_AMOUNT = 100000;
const APPROVE_AMOUNT = 10000;
const EMPTY_ACCOUNT = 0;

let coinBase;

contract("YatzyCoin", (accounts) => {

  const owner = accounts[0];
  const alice = accounts[1];
  const aliceOp = accounts[2];
  const bob = accounts[3];

  beforeEach(async () => {
    coinBase = await YatzyCoin.new({from: owner});
  });

  afterEach(async () => {
    await coinBase.destroy({from: owner});
  });

  it("should have correct name and symbol", async () => {
  	const name = await coinBase.name();
  	assert.equal (name, NAME);
	const symbol = await coinBase.symbol();
	assert.equal (symbol, SYMBOL);
  })

  it("should have initial supply equal to owner balance", async () => {
  	const supply = await coinBase.totalSupply();
  	assert.equal (supply, INITIAL_SUPPLY);
	const balance = await coinBase.balanceOf(owner);
	assert.equal (balance, INITIAL_SUPPLY);
	assert.equal (supply.toString(), balance.toString());
  })

  it("should allow minting by owner", async () => {
	try{
	  await coinBase.mintToOwner(MINT_AMOUNT, {from: owner});
	} catch(e) {
	  assert(false);
	  return;
	}
  	const supply = await coinBase.totalSupply();
  	assert.equal (supply, INITIAL_SUPPLY + MINT_AMOUNT);
	const balance = await coinBase.balanceOf(owner);
	assert.equal (balance, INITIAL_SUPPLY + MINT_AMOUNT);
	assert.equal (supply.toString(), balance.toString());
  })

  it("should not allow minting by non-owner", async () => {
	try{
	  await coinBase.mintToOwner(MINT_AMOUNT, {from: alice});
	} catch(e) {
	  assert(true);
	  return;
	}
  	assert(false);
  })

  it("should allow transfer to account", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	} catch(e) {
	  assert(false);
	  return;
	}
  	let balance = await coinBase.balanceOf(owner);
	assert.equal (balance, INITIAL_SUPPLY - TRANSFER_AMOUNT);
	balance = await coinBase.balanceOf(alice);
	assert.equal (balance, TRANSFER_AMOUNT);

	try{
	  await coinBase.transfer(bob, TRANSFER_AMOUNT, {from: alice});
	} catch(e) {
	  assert(false);
	  return;
	}
	balance = await coinBase.balanceOf(bob);
	assert.equal (balance, TRANSFER_AMOUNT);
	balance = await coinBase.balanceOf(alice);
	assert.equal (balance, EMPTY_ACCOUNT);
  })

  it("should allow burn from account by account", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	  let balance = await coinBase.balanceOf(alice);
	  assert.equal (balance, TRANSFER_AMOUNT);
	  await coinBase.burnFrom(alice, TRANSFER_AMOUNT, {from: alice});
	  balance = await coinBase.balanceOf(alice);
	  assert.equal (balance, EMPTY_ACCOUNT);
	  let supply = await coinBase.totalSupply();
	  assert.equal (supply, INITIAL_SUPPLY - TRANSFER_AMOUNT);
	} catch(e) {
	  assert(false);
	  return;
	}
	assert(true);
  })

  it("should not allow burn from account by other account", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	  let balance = await coinBase.balanceOf(alice);
	  assert.equal (balance, TRANSFER_AMOUNT);
	  await coinBase.burnFrom(alice, TRANSFER_AMOUNT, {from: bob});
	} catch(e) {
	  assert(true);
	  return;
	}
	assert(false);
  })

  it("should not allow transfer of insufficient funds", async () => {
	try{
	  await coinBase.transfer(bob, TRANSFER_AMOUNT, {from: alice});
	} catch(e) {
	  assert(true);
	  return;
	}
  	assert(false);
  })

  it("should allow transfer from acoount to account by account owner", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	  await coinBase.transferFrom(alice, bob, TRANSFER_AMOUNT, {from: alice});
	} catch(e) {
	  assert(false);
	  return;
	}
	let balance = await coinBase.balanceOf(bob);
	assert.equal (balance, TRANSFER_AMOUNT);
	balance = await coinBase.balanceOf(alice);
	assert.equal (balance, EMPTY_ACCOUNT);
  })

  it("should not allow transfer from acoount to account by non account owner", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	  await coinBase.transferFrom(alice, bob, TRANSFER_AMOUNT, {from: bob});
	} catch(e) {
	  assert(true);
	  return;
	}
  	assert(false);
  })

  it("should allow approval account access and spending of amount", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	  let balance = await coinBase.balanceOf(alice);
	  assert.equal (balance, TRANSFER_AMOUNT);
	  await coinBase.approve(bob, APPROVE_AMOUNT, {from: alice});
	  let approvalAmount = await coinBase.allowance(alice, bob);
	  assert.equal (approvalAmount, APPROVE_AMOUNT);
	  balance = await coinBase.balanceOf(alice);
	  assert.equal (balance, TRANSFER_AMOUNT);
	  await coinBase.transferFrom(alice, owner, APPROVE_AMOUNT, {from: bob});
	  approvalAmount = await coinBase.allowance(alice, bob);
	  assert.equal (approvalAmount, EMPTY_ACCOUNT);
	  balance = await coinBase.balanceOf(alice);
	  assert.equal (balance, TRANSFER_AMOUNT - APPROVE_AMOUNT);
	  balance = await coinBase.balanceOf(owner);
	  assert.equal (balance, INITIAL_SUPPLY - TRANSFER_AMOUNT + APPROVE_AMOUNT);
	} catch(e) {
	  assert(false);
	  return;
	}
  })

  it("should not allow approved account to spend over approval amount", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	  let balance = await coinBase.balanceOf(alice);
	  assert.equal (balance, TRANSFER_AMOUNT);
	  await coinBase.approve(bob, APPROVE_AMOUNT, {from: alice});
	  await coinBase.transferFrom(alice, owner, TRANSFER_AMOUNT, {from: bob});
	} catch(e) {
	  assert(true);
	  return;
	}
	assert(false);
  })

  it("should allow approval increase of amount", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	  await coinBase.approve(bob, APPROVE_AMOUNT, {from: alice});
	  let approvalAmount = await coinBase.allowance(alice, bob);
	  assert.equal (approvalAmount, APPROVE_AMOUNT);
	  await coinBase.increaseApproved(bob, APPROVE_AMOUNT, {from: alice});
	  approvalAmount = await coinBase.allowance(alice, bob);
	  assert.equal (approvalAmount, APPROVE_AMOUNT + APPROVE_AMOUNT);
	} catch(e) {
	  assert(false);
	  return;
	}
  })

  it("should allow approval decrease of amount, including underflow", async () => {
	try{
	  await coinBase.transfer(alice, TRANSFER_AMOUNT, {from: owner});
	  await coinBase.approve(bob, APPROVE_AMOUNT + APPROVE_AMOUNT, {from: alice});
	  let approvalAmount = await coinBase.allowance(alice, bob);
	  assert.equal (approvalAmount, APPROVE_AMOUNT + APPROVE_AMOUNT);
	  await coinBase.decreaseApproved(bob, APPROVE_AMOUNT, {from: alice});
	  approvalAmount = await coinBase.allowance(alice, bob);
	  assert.equal (approvalAmount, APPROVE_AMOUNT);
	  await coinBase.decreaseApproved(bob, APPROVE_AMOUNT + APPROVE_AMOUNT, {from: alice});
	  approvalAmount = await coinBase.allowance(alice, bob);
	  assert.equal (approvalAmount, EMPTY_ACCOUNT);
	} catch(e) {
	  assert(false);
	  return;
	}
  })

});