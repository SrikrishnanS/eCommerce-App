//independent script file to lazy-read the input data file and write the data to csv files
// Run this by - node extract.js

var file = require('fs');
var lazy = require("lazy");

var productSourceFile = "./src/Project2Data.txt";
var productDumpFile = "./src/product-dump.csv";
var categoryDumpFile = "./src/category-dump.csv";

//Regular expressions for pattern matching, used for extracting data
var idExp = /Id:(\s*)(\d+)/
var asinExp = /ASIN:(\s*)(\w+)/
var titleExp = /(\s*)title:(\s*)(.+)/
var groupExp = /(\s*)group:(\s*)(.+)/
var categoryExp = /(\s*)\|(.+)/
var product = [];

var itemNumber = -1;

new lazy(file.createReadStream(productSourceFile)).lines.forEach(function(item){ //Extract and transform operation
    var line = item.toString();
    if(line.match(idExp)) { //For Ids
    	itemNumber++;
    	product.push(new Object());
    	product[itemNumber].ID = parseInt(line.match(idExp)[2]);
    }
    else if(line.match(asinExp)) { //For ASINs
    	product[itemNumber].asin = line.match(asinExp)[2];
    }
    else if(line.match(titleExp)) { //For titles
    	product[itemNumber].title = line.match(titleExp)[3];
    }
    else if(line.match(groupExp)) { //For groups
    	product[itemNumber].group = line.match(groupExp)[3];
    }
    else if(line.match(categoryExp)) {//For categories
    	product[itemNumber].categories = product[itemNumber].categories || []; //check if array already exists, or else create it
    	product[itemNumber].categories.push(line.match(categoryExp)[2]); //push the new category for the particular product
    }
}).on('pipe', function() { //Load operation
    var productDumpStream = file.createWriteStream(productDumpFile);
    var categoryDumpStream = file.createWriteStream(categoryDumpFile);
    for(item in product) {
    	productDumpStream.write(product[item].ID+",");
    	productDumpStream.write(product[item].asin+",");
    	productDumpStream.write(product[item].title+",");
    	productDumpStream.write(product[item].group+"\n");

    	var category = product[item].categories;
    	for(chain in category) {
    		categoryDumpStream.write(product[item].ID+",");
    		categoryDumpStream.write(category[chain]+"\n");
    	}
    }
    productDumpStream.end();
    categoryDumpStream.end();
});