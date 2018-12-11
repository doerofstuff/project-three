
const SHA256 = require('crypto-js/sha256');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const Joi = require('joi');


class BlockController {

    constructor(server) {
        this.server = server;
        this.chainDB = new BlockChain.Blockchain();
        this.initializeMockData().then(cArray => {
            this.chainArray = cArray;
            console.log(this.chainArray)
        });
        this.initializeRoutes();
    }

    initializeRoutes(){
        
        this.server.route({
            method: 'GET',
            path: '/block/{index}',
            handler: async (request, h) => {
                let reqHeight = encodeURIComponent(request.params.index);
                let height = await this.chainDB.getBlockHeight();
                let validate = Joi.validate(reqHeight,Joi.number().integer().min(0).max(height).required())
                if(validate.error == null){
                    let block = await this.chainDB.getBlock(reqHeight);
                    return h.response(block).code(200);
                } else {

                    let errorObj = {
                        statusCode: 413,
                        error: validate.error.name,
                        message: validate.error.details[0].message
                    }
                    
                    return h.response(errorObj).code(400)

                }
                
               

            }
        });

        this.server.route({
            method: 'POST',
            path: '/block',
            handler: async (request, h) => {
                console.log(request.payload)
                var payload = request.payload 
                if(payload){
                    var blockData = encodeURIComponent(payload.body)
                    let addedBlock = await this.chainDB.addBlock(new Block.Block(blockData));
                    return addedBlock;
                } 
            }
        });

    }

    async initializeMockData() {
        let currentBlock = await this.chainDB.getCurrentBlock()
        console.log('Blockchain initialized, returning block array');
        let chainArray = await this.chainDB.bd.blockArray();
        return chainArray;
    }
    
}

module.exports = (server) => { return new BlockController(server);}
