/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB,{valueEncoding:"json"});
    }

    // Get data from levelDB with key (Promise)
    getData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember un Promises you need to resolve() or reject()
            self.db.get(key,(error,val) => {
                if(error){reject(error)}
                resolve(val)
            })
        });
    }

    // Add data to levelDB with key and value (Promise)
    addData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember un Promises you need to resolve() or reject() 
            self.db.put(key, value, (error,val) => {
                if(error){reject(error)}
                console.log('Succesfully added block: ')
                resolve(value)
                
            });
        })
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(async function(resolve, reject){
            // Add your code here, remember un Promises you need to resolve() or reject()
            let i = 0;
            self.db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                console.log('Unable to read data stream!', err)
            }).on('close', function() {
                
                resolve(i)
            });

        });
    }

    blockHeight(){
        let self = this;
        return new Promise(async function(resolve, reject){
            // Add your code here, remember un Promises you need to resolve() or reject()
            let count = 0;
            self.db.createReadStream().on('data', function(data) {
                count++
            }).on('error', function(err) {
                console.log('Unable to read data stream!', err)
            }).on('close', function() {
                resolve(count - 1)
            });

        });
    }

    blockArray(block) {
        let self = this;
        
        return new Promise(function(resolve, reject){
            // Add your code here, remember un Promises you need to resolve() or reject()
            let chain = [];
            self.db.createReadStream().on('data', function(data) {
                chain.push(data.value);
            }).on('error', function(err) {
                console.log('Unable to read data stream!', err)
            }).on('close', function() {
                resolve(chain)
            });

        });
    }
        

}


module.exports.LevelSandbox = LevelSandbox;