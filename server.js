var express    = require('express');
var app        = express();
var mysql      = require('mysql');
 var connection = mysql.createConnection({
       host     : '127.0.0.1',
       user     : 'root',
       password : '1234', 
     });
app.use(express.static(__dirname+"/view" ));
// app.use(express.bodyParser());
app.get('/',function(req,res){
    res.render('index');
}); 
app.get('/data',function(req,res){
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
});
app.post('/query?',function(req,res){
   console.log(req.query );
   res.setHeader('Content-Type', 'application/json');
   //connectdatabase(req.query.database);
   console.log(typeof req.query.table);
   if(typeof req.query.table == Array){
      selectJoin(req.query.table);
   }
   else{
      selectAll(req.query.table);
   }
   
   // var myObj = JSON.stringify(req.query);
   // console.log(myobj);
   res.send();
});
app.post('/delete/:key',function(req,res){
    console.log(req.params.key);
    deleteData(req.params.key)
    selectAll();
    res.end(json);
});
function connectdatabase(name){
  connection.end();
  connection = mysql.createConnection({
      host     : '127.0.0.1',
      user     : 'root',
      password : '1234',
      database : name
    });
    connection.connect();
}
var json='';
app.post('/selectDB?',function(req,res){
  console.log(req.query );
   res.setHeader('Content-Type', 'application/json');
   console.log(req.query.database);
   tablename(req.query.database);
   // var myObj = JSON.stringify(req.query);
   // console.log(myobj);
   res.send();
});
function selectAll(key){
connection.query('SELECT * from '+key+" limit 100;", function(err, rows, fields) {
  if (err) throw err;
  json=JSON.stringify(rows);
});
}
function selectJoin(obj){
// connection.query('SELECT * from '+obj[1]["table"], function(err, rows, fields) {
connection.query('SELECT * FROM '+obj[0]+' INNER JOIN '+obj[1]+' limit 100;', function(err, rows, fields) {
  if (err) throw err;
  json=JSON.stringify(rows);
});
}
function showdata(){
// connection.query('SELECT * from '+obj[1]["table"], function(err, rows, fields) {
connection.query('show databases;', function(err, rows, fields) {
  if (err) throw err;
  json=JSON.stringify(rows);
  console.log(json);
});
}
function tablename(key){
  connectdatabase(key);
  connection.query('show tables;',function(err,rows,fields){
   if (err) throw err;
   json=JSON.stringify(rows);
   console.log(rows);
});
} 
// function insertData(){
//     connection.query('INSERT teacher values ("0987654321","book","gok@gmail.com");', function(err,result, fields) {
//     if (err) throw err;

//         console.log('success');
//         });
// }
function deleteData(data){
  connection.query('delete from city where ID='+data+';', function(err,result, fields) {
    if (err) throw err;
        console.log('success');
      });
}
connection.connect();
showdata();
app.listen(3000);