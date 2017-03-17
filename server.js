var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '1234',
  database : 'world'
});

connection.connect();

connection.query('SELECT * from city', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows);
});

connection.end();