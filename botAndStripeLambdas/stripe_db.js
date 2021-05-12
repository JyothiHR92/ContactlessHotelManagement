const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config.json');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
var mysql = require('mysql');
var pool = mysql.createPool({
	host : config.dbhost, // give your RDS endpoint here
	user : config.dbuser, // Enter your MySQL username
	password : config.dbpassword , // Enter your MySQL password
	database : config.dbdatabase, // Enter your MySQL database name.
	port : config.port,
	ssl : config.dbssl
});


app.post('/updatePayment', async(req, res) => {
	let customer= req.body.customerID;
	let amount = parseInt(req.body.price);
	//let tax_amount = amount+amount*0.085;
	console.log(customer);
	console.log(amount);
	let query = `INSERT INTO PaymentDetails(customerID, amount) VALUES(?, ?)`;
  console.log(query);
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("Database Connected!");
    connection.query(query,[customer, amount], (err, results, fields) => {
      connection.release();
        if (err) {
          const response = { data: null, message: err.message, };
          res.send(response);
        }
        console.log('here');
        const ans = results;
        console.log(JSON.stringify(results));
        const response = {
        	statusCode: 200,
        	headers: {
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              
          },
        	data: ans,
          message: 'Payment table successfully updated.',
        };
        console.log(results);
        res.send(response);
        // connection.end();
  });

  });
});

var date = new Date();
var checkoutdate = date.toJSON().slice(0, 19).replace('T', ' ');

app.post('/checkout', async(req, res) => {
	let customer= req.body.customerID;
	console.log(customer);
	let updateQuery = `Update Reservations SET isCheckedOut = 1, checkOutDate=? where customerID=? AND isCheckedIn=1`;
	console.log(updateQuery);
	pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("Database Connected!");
    connection.query(updateQuery,[checkoutdate, customer], (err, results, fields) => {
      connection.release();
        if (err) {
          const response = { data: null, message: err.message, };
          res.send(response);
        }
          const ans = results;
          console.log(results);
          const response = {
          	statusCode: 200,
          	headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                
            },
          	data: ans,
            message: 'Payment table successfully updated.',
          };
          console.log(results);
          res.send(response);
    });
        
  });
});

app.post('/updateConcierge', async(req, res) => {
	let customer= req.body.customerID;
	console.log(customer);
	let updateQuery = `Update ConciergeBooking SET isPaid = 1 where customerID=? AND isPaid=0`;
	console.log(updateQuery);
	pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("Database Connected!");
    connection.query(updateQuery,[customer], (err, results, fields) => {
      connection.release();
        if (err) {
          const response = { data: null, message: err.message, };
          res.send(response);
        }
          const ans = results;
          console.log(results);
          const response = {
          	statusCode: 200,
          	headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                
            },
          	data: ans,
            message: 'Payment table successfully updated.',
          };
          console.log(results);
          res.send(response);
    });
        
  });
});
	
module.exports = app;