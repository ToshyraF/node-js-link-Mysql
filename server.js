var express    = require('express');
var app        = express();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '1234',
  database : 'school'
});
app.use(express.static(__dirname+"/view" ));
app.get('/',function(req,res){
    res.render('index');

}); 
app.get('/data',function(req,res){
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
    //res.end();
    //connection.connect();
    //insertData();
    //connection.end();
});

var json='';
function selectAll(){
connection.query('SELECT * from student', function(err, rows, fields) {
  if (err) throw err;
  json=JSON.stringify(rows);
});
}
function insertData(){
    connection.query('INSERT student values ("0987654321","book","gok@gmail.com");', function(err,result, fields) {
    if (err) throw err;

        console.log('success');
        });
}
connection.connect();
// insertData();
selectAll();
//connection.end();
app.listen(3000);