var express = require('express');
app = express();

/* DB ACCESS */

// npm install mysql
const mysql = require('mysql');

// define the connection credentials
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'test',
    password : 'test',
    database    : 'world'
});

// connect to the database: Throw error if not successful
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

/* -------------------- */

// Basic routing and GET parameters

app.get('/', function(req, res) {
    if (typeof req.query['username'] !== 'undefined'){
        res.send('Username: ' + req.query['username']);
    }
    else res.send('Username is not set');
});

app.get('/send', function(req, res) {
    
    // Select request with prevention of sql injection
    var id = 1000;

    var query = connection.query('select * from city where ID = ?', id , function(err, result){
        if (err){
            console.error(err);
            return;
        }
        console.log(result);

    });
    res.send('Select data with the id: ' + id + ' from the DB');
});

// Post data to the server
app.get('/post', function(req, res) {
    
    // Insert request with prevention of sql injection
    var post  = { District:'Ebersberg', Population:'200', CountryCode:'ARE', Name:'Grafing'};

    var query = connection.query('insert into city SET ?', post, function(err, result){
    if (err){
        console.error(err);
        return;
    }
    console.error(result);
    });
    res.send('The database was updated with the data: ' + 'Name: ' + post.Name + ' Country Code: ' + post.CountryCode);
 
});

app.get('/delete', function(req, res) {
    
    // Deletion of the entry with the highest ID

    var query = connection.query('DELETE FROM city ORDER BY ID DESC LIMIT 1', function(err, result){
    if (err){
        console.error(err);
        return;
    }
    console.error(result);
    });
    res.send('The entry with the highest ID was deleted from the database.');
 
});

// Make it listen on port 3000
app.listen(3000, () => {
    console.log('Server started on port '+3000)
});
