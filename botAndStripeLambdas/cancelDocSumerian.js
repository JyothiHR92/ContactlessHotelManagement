'use strict';
console.log('Loading event');

//const generate = require('nanoid/generate');
//const nanoid_lc  = require('nanoid-dictionary/lowercase');
const nanoId = require('nanoid')
let ids = nanoId.customAlphabet('abcdef', 5);
//ids()
var AWS = require('aws-sdk');
var mysql = require('mysql');
var config = require('./config.json');
const sns = new AWS.SNS();
var connection = mysql.createConnection({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname,
  port: config.port
});

var dynamodb = new AWS.DynamoDB.DocumentClient();
var tableName = 'docBooking';

var date = new Date();


var customer_ID;
//var gen_nanoid = ids();


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




function cancelDocBooking(intent, callback) {
  var phoneNumber;
  var messageText;
  console.log(`request received for userId=${intent.userId}, intentName=${
      intent.currentIntent.name}`);
  // const sessionAttributes = intent.sessionAttributes;
  const slots = intent.currentIntent.slots;
  const contact_Num = parseInt(slots.PhoneNum, 10);

  // var booking_date =
  //     new Date(slots.PickUpDate + ' ' + slots.PickUpTime + ':00');
  // console.log(booking_date);
  // console.log(date);
  // if (booking_date.getTime() < date.getTime()) {
  //   callback(close(intent.sessionAttributes, 'Fulfilled', {
  //     'contentType': 'PlainText',
  //     'content': 'DateTime selected is in past. Please select the future date and time.'
  //   }));
  //   return;
  // }

  
  const promise = new Promise((resolve, reject) => {
  //     connection.query( 'SELECT customerID FROM CustomerDetails WHERE contactNum = ?', [contact_Num],
  //     function(err, rows) {
  //       if (err) {
  //         reject(err);
  //       } 
  //         //var customer_ID = rows[0].customerID;
  //       else if(rows.length > 0) {
  //           resolve(rows[0].customerID);
          
  //           connection.end();
  //       }
  //       else {
  //           connection.end();
  //           callback(close(
  //               intent.sessionAttributes, 'Fulfilled',
  //               {'contentType': 'PlainText', 'content': 'Your booking is not found. Please retry with phone number used at the time of booking.'}));
  //         }
  //     });

   
  // });

  // promise
  //     .then( // Handle success of sql connection
  //         (customer_id) => {
  //           // This is promise chaining. Return promise from inside promise.
  //           return new Promise((resolve, reject) => {
              console.log(slots.bookingID);
  //            updateDynamo(slots, customer_id, function(err, content2) {
              updateDynamo(slots, function(err, content2) {
                if (err) {
                  reject(err);
                } else {
                  resolve(content2);
                }
              });
           // });
          },
        // Handle failure of fetch ID
          (err) => {
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Error.'}));
          })
      .then(
          // Handle success of updateDynamo
          (content2) => {
            if (content2.statusCode == '200') {
                console.log("here");
              
              // var params = {
              //   Message: `Your request to cancel doctor is successfully processed.`,
              //   PhoneNumber: "+1"+slots.PhoneNum,
              //   Subject: 'Doc cancel Confirmation'
              // };
              // sns.publish(params, function(err, data) {
              //     if (err) console.log(err, err.stack); // an error occurred
              //     else     console.log(data); 
                
              // });
              callback(close(intent.sessionAttributes, 'Fulfilled', {
                'contentType': 'PlainText',
                'content':
                     `Your request to cancel doctor is successfully processed.`}));
            }
          },
          // Handle failure of updateDynamo
          (err) => {
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Sorry something went wrong with your booking. Please retry.'}));
          });
}

async function updateDynamo(slots, callback2) {
  var params = {
    TableName: tableName,
    Key: {
      id: (slots.bookingID).toLowerCase(),
    },
    // UpdateExpression: "set status = :s",
    // ExpressionAttributeValues:{
    //     ":s":"cancelled",
    // },
    // ReturnValues:"UPDATED_NEW",
   
  };

  // console.log(gen_nanoid);
  await dynamodb.delete(params, function(err, data) {
    if (err) {
      console.log(err);
      callback2(err, null);
    } else {
      console.log(data);
      callback2(null, {statusCode: '200'});
    }
  });
}

exports.handler = (event, context, callback) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    cancelDocBooking(event, (response) => {
        //console.log(response);
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};