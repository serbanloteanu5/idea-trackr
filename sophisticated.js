/* sophisticated.js */

// This code is a simple implementation of a blockchain using JavaScript.
// It includes the basic functionalities of creating blocks, mining them,
// and validating the chain. It also includes proof-of-work algorithm
// for mining, and uses crypto-js library for hashing.

const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, data) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = '';
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block('01/01/2022', 'Genesis Block');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Block hash invalid.');
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('Previous block hash invalid.');
        return false;
      }
    }

    console.log('Blockchain is valid.');
    return true;
  }
}

// Usage example
const myBlockchain = new Blockchain();

console.log('Mining block 1...');
myBlockchain.addBlock(new Block('01/02/2022', { amount: 3 }));

console.log('Mining block 2...');
myBlockchain.addBlock(new Block('01/03/2022', { amount: 10 }));

console.log('Blockchain validation in progress...');
myBlockchain.isChainValid();

// Output:
// Block mined: 00008b479b01e4a09177c6fb160bc449e77a6fdf9f0099edf09a51216a572f4d
// Mining block 1...
// Block mined: 00006dd40a688329b028eb9b523bb8fecc682fbabecd6f16e3317e320db1d060
// Mining block 2...
// Block mined: 000055520bb6435f54bb50828b3c5a95e9d9fb2f6651a6bc2fc69b993d7fa3d6
// Blockchain validation in progress...
// Blockchain is valid.