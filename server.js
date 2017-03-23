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
// app.use(express.bodyParser());
app.get('/',function(req,res){
    res.render('index');

}); 
app.get('/data',function(req,res){
    res.setHeader('Content-Type', 'application/json');
    //selectAll()
    res.end(json);
    //res.end();
    //connection.connect();
    //insertData();
    //connection.end();
});
app.post('/delete/:key',function(req,res){
    console.log(req.params.length);
    deleteData(req.params.key)
    res.setHeader('Content-Type', 'application/json');
    selectAll();
    res.end(json);
});
app.post('/add',function(req,res){
    // console.log(req.params.length);
    // deleteData(req.params.key)
    insertData();
    res.setHeader('Content-Type', 'application/json');
    selectAll();
    res.end(json);
});
var json='';
function selectAll(){
connection.query('SELECT * from teacher', function(err, rows, fields) {
  if (err) throw err;
  json=JSON.stringify(rows);
});
}
function insertData(){
    connection.query('INSERT teacher values ("0987654321","book","gok@gmail.com");', function(err,result, fields) {
    if (err) throw err;

        console.log('success');
        });
}
function deleteData(data){
  connection.query('delete from teacher where teacherID='+data+';', function(err,result, fields) {
    if (err) throw err;
        console.log('success');
        });
}
connection.connect();
selectAll()
// insertData();
//connection.end();
app.listen(3000);