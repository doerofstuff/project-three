const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.getCurrentBlock().then(this.bd.blockArray());
        
    }

    async getCurrentBlock(){
        let count = await this.getCount();
        let currentBlock;
        if(count === 0){
            let genBlock = this.generateGenesisBlock();
            currentBlock = await this.bd.addData(0,genBlock);
        } else {
            currentBlock = await this.getBlock(count - 1)
        }
        return currentBlock;
    }

    generateGenesisBlock(){
        let genBlock = new Block.Block(true,true);
        genBlock.hash = SHA256(JSON.stringify(genBlock)).toString();
        return genBlock;
    }

    async getCount() {
        let count =  await this.bd.getBlocksCount();
        return count;
    }

    async getBlockHeight() {
        let height =  await this.bd.blockHeight();
        return height;
    }

    async addBlock(newBlock) {
        let currentBlock = await this.getCurrentBlock();
        newBlock.height = currentBlock.height + 1;
        newBlock.previousBlockHash = currentBlock.hash;
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        let blockAdded =  await this.bd.addData(newBlock.height,newBlock);
        return blockAdded
    }

    // Get Block By Height
    getBlock(height) {
        return this.bd.getData(height)
    }
    
    async validateChain(){
        console.log('VALIDATING CHAIN')
        let errorLog = [];
        let blockHeight = await this.getBlockHeight()
        for (var i = 0; i <= blockHeight; i++) {
            
            let block = await this.getBlock(i);
            let blockHash = block.hash
            let validateBlock = this.validateBlockWithBlock(block,block.hash);
            if(validateBlock == false){
                errorLog.push(i)
            } else {
                console.log('HASH IS VALID for BLOCK #' + i);
            }

            if(i < blockHeight){
                let nextBlock = await this.getBlock(i + 1)
                let nextBlocksPrevHash = nextBlock.previousBlockHash
            // console.log('COMPARE NEXT BLOCKS PREVIOUS HASH');
            // console.log(nextBlocksPrevHash);
                if (blockHash!==nextBlocksPrevHash) {
                    errorLog.push(i);
                }  else {
                    console.log('BLOCK #' + i + ' Hash matches the previousBlockhash of BLOCK #' + (i +1))
                }
            } else {
                console.log('Current Block Cannot yet be validated by way of the next blocks prevhash')
            }
        console.log('VALIDATED CHAIN');
            
        }

        if (errorLog.length>0) {
            // console.log('Block errors = ' + errorLog.length);
            // console.log('Blocks: '+errorLog);
          } else {
            console.log('NO ERRORS DETECTED THROUGH CHAIN');
          }
        
          return errorLog;
    }

    validateBlockWithBlock(block,hash){
        let modBlock = block;
        modBlock.hash = '';
        let validBlockHash = SHA256(JSON.stringify(modBlock)).toString();
        if (hash===validBlockHash) {
            // console.log('HASH VALID');
            // console.log(hash);
            return true; 
        } else {
          //console.log('Block #'+modBlock.height+' invalid hash: '+hash+'<>'+validBlockHash);
          return false;
        }
    }

    async validateBlock(height){
        let block = await this.getBlock(height);
        let blockHash = block.hash;
        block.hash = '';
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        if (blockHash===validBlockHash) {
            // console.log('Block #'+height+' VALID hash: '+blockHash+' == '+validBlockHash);
            return true;
        } else {
          // console.log('Block #'+blockHeight+' invalid hash: '+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addData(height, block).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }

    
}

module.exports.Blockchain = Blockchain
