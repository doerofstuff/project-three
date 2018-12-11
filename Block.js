/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data,isGenesis){
		this.height = isGenesis ? 0 : "";
		this.time = new Date().getTime().toString().slice(0,-3);
		this.body = isGenesis ? "This is the Genesis Block" : data;
		this.previousBlockHash = "";
		this.hash = ""
	}
}

module.exports.Block = Block;