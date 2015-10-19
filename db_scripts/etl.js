//independent script file to lazy-read the input data file and write the data to csv files
// Run this by - node extract.js

var file = require('fs');
var lazy = require("lazy");

var productSourceFile = "./src/amazon-meta.txt";
var productDumpFile = "./src/product-dump.csv";
var categoryDumpFile = "./src/category-dump.csv";
var reviewDumpFile = "./src/review-dump.csv";

//Regular expressions for pattern matching, used for extracting data
var idExp = /Id:(\s*)(\d+)/
var asinExp = /ASIN:(\s*)(\w+)/
var titleExp = /(\s*)title:(\s*)(.+)/
var groupExp = /(\s*)group:(\s*)(.+)/
var salesrankExp = /(\s*)salesrank:(\s*)(.+)/
var similarExp = /(\s*)similar:(\s*)(\d+)(\s*)(.+)/
var categoryExp = /(\s*)\|(.+)/
var reviewsExp = /(\s*)reviews:(\s*)(.+)/
var downloadedExp = /(\s*)downloaded:(\s*)(\d+)/
var avgRatingExp = /(\s*)avg rating:(\s*)(.+)/
var reviewItemExp = /(\s*)(\d{4}-\d{1,2}-\d{1,2})(.+)/
var customerExp = /(\s*)cutomer:(\s*)(\w+)/
var ratingExp = /(\s*)rating:(\s*)(\d+)/
var votingExp = /(\s*)votes:(\s*)(\d+)/
var helpfulExp = /(\s*)helpful:(\s*)(\d+)/

product = null;

var productDumpStream = file.createWriteStream(productDumpFile);
var categoryDumpStream = file.createWriteStream(categoryDumpFile);
var reviewDumpStream = file.createWriteStream(reviewDumpFile);

function writeProduct(product) {
    console.log(product.ID);
    productDumpStream.write(product.ID+",");
    productDumpStream.write(product.asin+",");
    productDumpStream.write(product.title+",");
    productDumpStream.write(product.group+",");
    productDumpStream.write(product.salesrank+",");
    productDumpStream.write(product.similar+",");
    productDumpStream.write(product.downloaded+",");
    productDumpStream.write(product.avgRating+"\n");
    var category = product.categories;
    for(chain in category) {
        categoryDumpStream.write(product.ID+",");
        categoryDumpStream.write(category[chain]+"\n");
    }
    var review = product.reviews;
    for(item in review) {
        reviewDumpStream.write(product.ID+",");
        reviewDumpStream.write(review[item].date+",");
        reviewDumpStream.write(review[item].customer+",");
        reviewDumpStream.write(review[item].rating+",");
        reviewDumpStream.write(review[item].votes+",");
        reviewDumpStream.write(review[item].helpful+"\n");
    }
    delete product.categories;
    delete product.reviews;
    delete product;
}

new lazy(file.createReadStream(productSourceFile)).lines.forEach(function(item){ //Extract and transform operation
    var line = item.toString();
    if(line.match(idExp)) { //For Ids

        if(product != null) {
            writeProduct(product);
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
    else if(line.match(reviewsExp)) { //For reviews
        var reviews = line.match(reviewsExp)[3];
        product.downloaded = reviews.match(downloadedExp)[3]; //For downloads
        product.avgRating = reviews.match(avgRatingExp)[3]; //For average rating
    }
    else if(line.match(reviewItemExp)) { //For review item
        product.reviews = product.reviews || []; //check if array already exists, or else create it
        var review = review || new Object();//check if review already exists, or else create a new object
        var reviewItem = line.match(reviewItemExp)[3]; //For review detail
        review.date=line.match(reviewItemExp)[2]; //For date
        review.customer = reviewItem.match(customerExp)[3]; //For customer
        review.rating = reviewItem.match(ratingExp)[3]; //For rating
        review.votes = reviewItem.match(votingExp)[3]; //For votes
        review.helpful = reviewItem.match(helpfulExp)[3]; //For helpful
        product.reviews.push(review);
    }
    else if(line.match(categoryExp)) {//For categories
    	product.categories = product.categories || []; //check if array already exists, or else create it
    	product.categories.push(line.match(categoryExp)[2]); //push the new category for the particular product
    }
    
}).on('pipe', function() { //End the streams
    writeProduct(product); // write last product record
    productDumpStream.end();
    categoryDumpStream.end();
    reviewDumpStream.end();
});
