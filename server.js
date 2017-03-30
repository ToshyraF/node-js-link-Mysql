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
    console.log(json);
    res.end(json);
});
app.post('/query?',function(req,res){
   console.log(req.query );
   res.setHeader('Content-Type', 'application/json');
   console.log(typeof req.query.table);
   console.log(req.query.column);
    if(req.query.column == undefined){
      selectAll("*",req.query.table);
    } 
    else{ 
     if(typeof req.query.table == Array){
        selectJoin(req.query.table);
     }
     else{
        selectAll(req.query.column,req.query.table);
     }
    }
   res.send();
});

app.post('/delete/:key',function(req,res){
    console.log(req.params.key);
    deleteData(req.params.key)
    selectAll();
    res.end(json);
});
app.post('/database',function(req,res){
    databaseName();
    console.log(json)
    res.end();
});
var json='';
app.post('/selectDB?',function(req,res){
   res.setHeader('Content-Type', 'application/json');
   tableName(req.query.database);
   res.send(json);
});
app.post('/selectTB?',function(req,res){
   res.setHeader('Content-Type', 'application/json');
   console.log(req.query.table)
   columnName(req.query.table);
   res.send(json);
});
//////////////////////////////////////////////////////////////function/////////////////////////////////////////////////////////////////////////////
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
function selectAll(column,table){
  connection.query('SELECT '+column+' from '+table+" limit 100;", function(err, rows, fields) {
    if (err) throw err;
    json=JSON.stringify(rows);
  });
}
function selectJoin(obj){
  var temp="SELECT * FROM"+obj[0]
  for(var i=1;i<obj.length;i++){
    temp +='INNER JOIN '+obj[i]
  }
  temp+="limit 100;"
  connection.query(temp, function(err, rows, fields) {
      if (err) throw err;
      json=JSON.stringify(rows);
  });
}
function databaseName(){
  connection.query('show databases;', function(err, rows, fields) {
    if (err) throw err;
      json=JSON.stringify(rows);
      console.log(json);
  });
}
function tableName(key){
  connectdatabase(key);
  connection.query('show tables;',function(err,rows,fields){
   if (err) throw err;
   json=JSON.stringify(rows);
   console.log(rows);
  });
} 
function columnName(table){
    connection.query('select column_name from information_schema.columns where table_name="'+table+'";', function(err, rows) {
      if (err) throw err;
      json=JSON.stringify(rows);
    });
}
function deleteData(data){
  connection.query('delete from city where ID='+data+';', function(err,result, fields) {
    if (err) throw err;
        console.log('success');
      });
}

app.listen(3000);