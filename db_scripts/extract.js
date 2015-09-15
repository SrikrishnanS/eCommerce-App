//independent script file to read the input data file and write the data
// Run this by - node extract.js

fs = require('fs');
var lazy = require("lazy");

var productFile = "./Project2Data.txt";

//Regular expressions for pattern matching, used for extracting data
var idExp = /Id:(\s*)(\d+)/
var asinExp = /ASIN:(\s*)(\d+)/
var titleExp = /(\s*)title:(\s*)(.+)/
var categoryExp = /(\s*)\|(.+)/
var product = [];

var itemNumber = -1;

new lazy(fs.createReadStream(productFile)).lines.forEach(function(item){
    var line = item.toString();
    if(line.match(idExp)) { //For Ids
    	itemNumber++;
    	product.push(new Object());
    	product[itemNumber].ID = parseInt(line.match(idExp)[2]);
    }
    if(line.match(asinExp)) { //For ASINs
    	product[itemNumber].asin = line.match(asinExp)[2];
    }
    if(line.match(titleExp)) { //For titles
    	product[itemNumber].title = line.match(titleExp)[3];
    }
    if(line.match(categoryExp)) {//For categories
    	product[itemNumber].categories = product[itemNumber].categories || []; //check if array already exists, or else create it
    	product[itemNumber].categories.push(line.match(categoryExp)[2]); //push the new category for the particular product
    }
}).on('pipe', function() {
      console.log(product.length);
    });