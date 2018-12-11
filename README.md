# Project #3. Start a Web Service

This is Project 2, Start a Web Service with Node Frameworks. In this I've chosen the framework Hapi. The project was completed by implementing two new files:
__app.js__
__BlockController.js__
As well as requiring a few more packages that will need installing  on top of what was needed for the initial blockchain project for which this is built on top of. Namely, the packages 'hapi' and 'joi'

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.

## Testing the project

The file __createTen.js__ in the root directory will create 10 blocks,as well as genesis block if the chain doesn't exist. From there, you can run the other files prepended with 'this\_' in order to test that the chain functionality is correct. Make sure to note that if the 'test\_tamperedBlock.js' file is run before validateChain test, then validateChain should call errors, while it should not before hand:

* after installation run the app.js file as seen below:
	node app.js

 * Test GET Endpoint: http://localhost:8000/block/{index} by way of CURL or POSTMAN

* Test POST Endpoint: http://localhost:8000/block/ by way of CURL or POSTMAN, making sure to provide data payload:
* 
	{
		body: 'Your message for block data';
	}

