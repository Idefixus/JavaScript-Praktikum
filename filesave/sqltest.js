var sqlite3 = require('sqlite3').verbose();
var express = require('express');
const fs = require('fs');
var app = express();

var path = require('path');

// oPen db
var db = new sqlite3.Database('save_DB');

app.get('/', function(req, res){

    console.log("Hello default");    
    res.sendFile(path.join(__dirname + "/download.html"));
});

app.get('/save', function(req, res){

    console.log("Hello default");    
    res.sendFile(path.join(__dirname + "/save.html"));
});

app.get('/savehandle', function(req, res){

// Save data to DB and create file:
var stmt = db.prepare("INSERT into saves values(?,?,?)");
    
//Name
var nm = req.query.name;

//Password
var pw = req.query.password;
// Link to file
var link = "/saves/"+req.query.name+"_save.txt";

stmt.run(nm, pw, link);

stmt.finalize();
// Create file:

fs.writeFile("./saves/"+req.query.name+"_save.txt","This text is for file of "+req.query.name, function(){
    console.log("File saved to system");
    
    res.send("File saved to system");
});

});

app.get('/download', function(req, res){
    
    // Read file for password and username

//var query = "SELECT link from saves WHERE nm= "+ req.query.name + " and pw= " + req.query.password + " LIMIT 1";
var query = "SELECT link from saves WHERE nm = ? AND pw = ? LIMIT 1";
console.log(query);
let success = false;
db.get(query, [req.query.name, req.query.password], function(mis,row){
    if (row !== undefined){
        console.log("Link: " + row.link);
        success = true; 
        console.log(success);
        
        //
        console.log("Success: " + success);

        if (success){
            res.download('./saves/'+req.query.name+'_save.txt', req.query.name+'.txt', function(err){
                if (err) {
                    console.log("Download failed");
                    console.log(err);
                    
                } else {
                // Route to default page and show download successful
                console.log("Download successful"); 
                } 
            });
        }
        else {
            res.send("Download failed");
        }
    }
    else {
        console.log("There are no results:");
        console.log(mis);
        
    }
});

});

app.get('/retrieve', function (req, res) {
    // DB
    //db.run("DROP TABLE saves");
  // db.run("Create TABLE saves (nm TEXT, pw TEXT, link TEXT)");
   /* db.serialize(function(){
    
        var stmt = db.prepare("INSERT into saves values(?,?,?)");
    
            //Name
            var nm = "Third";

            //Password
            var pw = "pass";
            // Link to file
            var link = "/saves/"+nm+"_save.txt";
            
            stmt.run(nm, pw, link);
    
        stmt.finalize();
    */
   db.each("SELECT nm, pw, link from saves", function(err,row){
    console.log("Name: " + row.nm, "Password: " + row.pw, "Link: " + row.link);
    
//}); 
});
    

    //
  res.send('Retrieved data!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

