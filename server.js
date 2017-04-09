var express    = require('express');
var app        = express();
var mysql      = require('mysql');
var path = require('path');
 var connection = mysql.createConnection({
       host     : '127.0.0.1',
       user     : 'root',
       password : '1234',
     });
app.use(express.static(__dirname+"/view" ));
app.use(express.static(__dirname+"/css" ));
// app.use(express.bodyParser());
app.get('/',function(req,res){
    res.render('index');
});
var qson={"sad":"asd"};
app.get('/showData',function(req,res){
   res.sendFile(path.join(__dirname + '/view/showData.html'),qson);
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
app.post('/insert?',function(req,res){
 res.setHeader('Content-Type', 'application/json');
 console.log(req.query);
 var getjson = getKeys(req.query);
   var key = getjson[0] ;
   var value = getjson[1];
  //var data = getValuejson(req.query,key);

  insertTable(value);
  res.send();
});
app.post('/update?',function(req,res){
   res.setHeader('Content-Type', 'application/json');
   var getjson = getKeys(req.query);
   var key = getjson[0] ;
   var value = getjson[1];
  //var data = getValuejson(req.query,key);

  updateTable(key,value);
  res.send();
});

app.post('/delete?',function(req,res){
  console.log("delete");

   res.setHeader('Content-Type', 'application/json');
   var getjson = getKeys(req.query);
   var key = getjson[0] ;
   var value = getjson[1];
   console.log(key);
   console.log(value);
   deleteData(key,value);
   res.send();
    //selectAll();
    //res.end(json);
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
app.post('/search?', function(req, res){
      res.setHeader('Content-Type', 'application/json');
      //console.log("test = "+req.query.searchBox);
      search(req.query.table,req.query.column,req.query.searchBox);
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
function getKeys(objectFromApi) {
var key = [];
var value = [];
for(var name in objectFromApi )
{
    if (objectFromApi.hasOwnProperty(name))
    {
      key.push(name);
      value.push(objectFromApi[name]);
      console.log(name + ': ' + objectFromApi[name]);
    }

}
  return [key , value] ;
}
function insertTable(obj){
  var temp ='INSERT INTO '+obj[0]+' VALUES ('
  for(var i = 1; i < obj.length;i++){
    if(i < obj.length -1){
      temp += "'"+obj[i]+"',"
    }else{
      temp += "'"+obj[i]+"'"
    }
  }
  temp += ');'
  console.log(temp);
  connection.query(temp, function(err, rows, fields) {
    if (err) throw err;
    json=JSON.stringify(rows);
  });
}
function updateTable(objkey,obj){
  console.log("update");
  var temp =''
   temp += "UPDATE "+obj[0]+" SET "
    console.log(obj.length);
  for (var i = 2 ; i < obj.length; i++) {
    console.log(i);

    if(i == obj.length-1){
      temp += objkey[i]+"='"+obj[i]+"'"
    }else{
      temp += objkey[i]+"='"+obj[i]+"',"
    }
  }
  temp += "WHERE "+objkey[1]+"="+obj[1]+";"
  console.log(temp);
 connection.query(temp, function(err, rows, fields) {
    if (err) throw err;
    json=JSON.stringify(rows);
  });
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
    connection.query('show columns from '+table+';', function(err, rows) {
      if (err) throw err;
      json=JSON.stringify(rows);
    });
}
function deleteData(objkey,obj){
  var temp = 'delete from '+obj[0]+' where '+objkey[1]+'='+obj[1]+';'
  console.log(temp);
  connection.query(temp, function(err,result, fields) {
    if (err) throw err;
        console.log('success');
      });
}
function search(table,columns,keyword){
      first = "SELECT * FROM "+table+" WHERE ";
      last = '';
      for(var i= 0; i < columns.length; i++){
            last = last +columns[i]+" LIKE "+'"'+keyword+'"';
            console.log('Last = '+last+' times = '+i);
            if(i != columns.length - 1){
                  last = last+" or ";
            }
      }
      command = first+last+' ;';
      console.log('command = '+command);
  connection.query(command, function(err, rows, fields) {
    if (err) throw err;
    json=JSON.stringify(rows);
  });
}
app.listen(3000,function(){
  console.log("http://localhost:3000 is runing");
});
