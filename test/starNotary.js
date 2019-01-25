//import 'babel-polyfill';
const StarNotary = artifacts.require('starNotary')

let instance;
let accounts;

contract('StarNotary', async (accs) => {
    accounts = accs;
    instance = await StarNotary.deployed();
  });

  it('1 can Create a Star', async() => {
    let tokenId = 1;
    instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
  });

  it('2 lets user1 put up their star for sale', async() => {
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  it('3 lets user1 get the funds after the sale', async() => {
    let user1 = accounts[3]
    let user2 = accounts[2]
    let starId = 3
    let starPrice = web3.utils.toWei(".01", "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction =  await web3.eth.getBalance(user1)
    await instance.buyStar(starId, {from: user2, value: starPrice})
    let balanceOfUser1AfterTransaction =  await web3.eth.getBalance(user1)
    
    assert.equal(Number(balanceOfUser1BeforeTransaction)+Number(starPrice), Number(balanceOfUser1AfterTransaction));
  });

  it('4 lets user2 buy a star, if it is put up for sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.utils.toWei(".01", "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it('5 lets user2 buy a star and decreases its balance in ether', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 5
    let starPrice = web3.utils.toWei(".01", "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    
    let balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    let balanceAfterUser2BuysStar = await web3.eth.getBalance(user2)
    assert.equal(parseInt(balanceOfUser2BeforeTransaction)-parseInt(balanceAfterUser2BuysStar), parseInt(starPrice));
  });

  // Write Tests for:

// 1) The token name and token symbol are added properly.
it('6 checks token name and symbol', async() => {
  assert.equal(await instance.name.call(), 'Majid\'s Star Notary')
  assert.equal(await instance.symbol.call(), 'MSN')
});
// 2) 2 users can exchange their stars.
it('7 lets users exchange stars', async() => {
  let user1 = accounts[1]
  let user2 = accounts[2]
  let star1Id = 6
  let star2Id = 7
  await instance.createStar('star1', star1Id, {from: user1})
  await instance.createStar('star2', star2Id, {from: user2})
  await instance.exchangeStars(star1Id, star2Id, {from: user1})
  let star2Owner = await instance.ownerOf.call(star1Id);
  assert.equal(star2Owner, user2);
});

// 3) Stars Tokens can be transferred from one address to another.
it('8 lets user transfer stars', async() => {
  let user1 = accounts[1]
  let user2 = accounts[2]
  let starId = 8
  await instance.createStar('star1', starId, {from: user1})
  await instance.transferStar(user2, starId, {from: user1})
  let starOwner = await instance.ownerOf.call(starId);
  assert.equal(starOwner, user2);
});
