'use strict';
console.log('Loading event');
//const generate = require('nanoid/generate');
//const nanoid_lc  = require('nanoid-dictionary/lowercase');
const nanoId = require('nanoid');
let ids = nanoId.customAlphabet('abcdef', 5);
//ids()
var AWS = require('aws-sdk');
var mysql = require('mysql');
var config = require('./config.json');

var connection = mysql.createConnection({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname,
  port: config.port
});

// var dynamodb = new AWS.DynamoDB();
// var tableName = 'cabBooking';

var date = new Date();


// var customer_ID;
// var gen_nanoid = ids();


function close(sessionAttributes, fulfillmentState, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState,
      message,
    },
  };
}




function cancelAmenity(intent, callback) {
  console.log(`request received for userId=${intent.userId}, intentName=${
      intent.currentIntent.name}`);
  // const sessionAttributes = intent.sessionAttributes;
  const slots = intent.currentIntent.slots;
  const contact_Num = parseInt(slots.PhoneNum, 10);



  const promise = new Promise((resolve, reject) => {
      connection.query( 'SELECT customerID FROM CustomerDetails WHERE contactNum = ?', [contact_Num],
      function(err, rows) {
        if (err) {
          reject(err);
        } 
          //var customer_ID = rows[0].customerID;
        else if(rows.length > 0) {
            resolve(rows[0].customerID);
            console.log(rows[0].customerID);
        }
        else {
            //connection.end();
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Your booking is not found. Please retry with phone number used at the time of booking.'}));
          }
      });

   
  });

  promise
      .then( // Handle success of sql connection
          (customer_id) => {
            // This is promise chaining. Return promise from inside promise.
            return new Promise((resolve, reject) => {
              connection.query('UPDATE AmenitiesBooking SET isCancelled=1 where bookingID = ? AND customerID = ?',[parseInt(slots.orderID), customer_id], 
              function(err, content) {
                if (err) {
                  reject(err);
                  connection.end();
                } else if(content.changedRows >=1) {
                  resolve(content);
                  console.log(content)
                  callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': `Your request to cancel ${slots.amenityType} booking is processed.`}));
                  //connection.end();
                }
                else {
                  callback(close(intent.sessionAttributes, 'Fulfilled',
                  {'contentType': 'PlainText', 'content': `Confirmation number ${slots.orderID} doesnt seems to be valid. Please retry with valid confirmation number.`}));
                  //connection.end();
                }
              });
            });
          },
        // Handle failure of fetch ID
          (err) => {
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': `Sorry something went wrong. PLease retry.`}));
            //connection.close();
          });
}


exports.handler = (event, context, callback) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    cancelAmenity(event, (response) => {
        console.log(response);
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};