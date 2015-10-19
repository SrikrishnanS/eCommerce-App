//independent script file to lazy-read the input data file and write the data to csv files
// Run this by - node extract.js

var file = require('fs');
var lazy = require("lazy");

var productSourceFile = "./src/amazon-meta.txt";
var productDumpFile = "./src/product-dump.csv";
var categoryDumpFile = "./src/category-dump.csv";

//Regular expressions for pattern matching, used for extracting data
var idExp = /Id:(\s*)(\d+)/
var asinExp = /ASIN:(\s*)(\w+)/
var titleExp = /(\s*)title:(\s*)(.+)/
var groupExp = /(\s*)group:(\s*)(.+)/
var salesrankExp = /(\s*)salesrank:(\s*)(.+)/
var similarExp = /(\s*)similar:(\s*)(\d+)(\s*)(.+)/
var categoryExp = /(\s*)\|(.+)/
var product = null;

var itemNumber = -1;

var productDumpStream = file.createWriteStream(productDumpFile);
var categoryDumpStream = file.createWriteStream(categoryDumpFile);

new lazy(file.createReadStream(productSourceFile)).lines.forEach(function(item){ //Extract and transform operation
    var line = item.toString();
    if(line.match(idExp)) { //For Ids

        if(product != null) {
            productDumpStream.write(product.ID+",");
            productDumpStream.write(product.asin+",");
            productDumpStream.write(product.title+",");
            productDumpStream.write(product.group+",");
            productDumpStream.write(product.salesrank+",");
            productDumpStream.write(product.similar+"\n");
            var category = product.categories;
            for(chain in category) {
                categoryDumpStream.write(product.ID+",");
                categoryDumpStream.write(category[chain]+"\n");
            }
        }
        product = new Object();
    	product.ID = parseInt(line.match(idExp)[2]);
    }
    else if(line.match(asinExp)) { //For ASINs
    	product.asin = line.match(asinExp)[2];
    }
    else if(line.match(titleExp)) { //For titles
    	product.title = line.match(titleExp)[3];
    }
    else if(line.match(groupExp)) { //For groups
    	product.group = line.match(groupExp)[3];
    }
    else if(line.match(salesrankExp)) { //For sales rank
        product.salesrank = line.match(salesrankExp)[3];
    }
    else if(line.match(similarExp)) { //For similar
        product.similar = line.match(similarExp)[5];
    }
    else if(line.match(categoryExp)) {//For categories
    	product.categories = product.categories || []; //check if array already exists, or else create it
    	product.categories.push(line.match(categoryExp)[2]); //push the new category for the particular product
    }
}).on('pipe', function() { //End the streams
    productDumpStream.end();
    categoryDumpStream.end();
});