'use strict';
console.log('Loading event');
//const generate = require('nanoid/generate');
//const nanoid_lc  = require('nanoid-dictionary/lowercase');
const nanoId = require('nanoid');
let ids = nanoId.customAlphabet('abcdefghijklmnopqrstuvwxyz', 5);
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

var dynamodb = new AWS.DynamoDB();
var tableName = "cabBooking";

var date = new Date();


//var customer_ID;
//var gen_nanoid = ids();
var gen_nanoid;

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




function cabBooking(intent, callback) {
  console.log(`request received for userId=${intent.userId}, intentName=${
      intent.currentIntent.name}`);
  // const sessionAttributes = intent.sessionAttributes;
  const slots = intent.currentIntent.slots;
  const contact_Num = parseInt(slots.PhoneNum, 10);

  var booking_date =
      new Date(slots.PickUpDate + ' ' + slots.PickUpTime + ':00');
  console.log(booking_date);
  console.log(date);
  if (booking_date.getTime() < date.getTime()) {
    callback(close(intent.sessionAttributes, 'Fulfilled', {
      'contentType': 'PlainText',
      'content': 'DateTime selected is in past. Please pass the future date.'
    }));
    return;
  }

  const promise = new Promise((resolve, reject) => {
      connection.query( 'SELECT customerID FROM CustomerDetails WHERE contactNum = ?', [contact_Num],
      function(err, rows) {
        if (err) {
          reject(err);
          //connection.end();
        } 
          //var customer_ID = rows[0].customerID;
        else if(rows.length > 0) {
            console.log(rows);
            resolve(rows[0].customerID);
            //connection.end();
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
      .then((customer_id) => {
        //validate booking is still valid
        return new Promise((resolve, reject) => {
          connection.query( 'SELECT * from Reservations where customerID=? AND isCheckedIn=1 AND isCheckedOut=0', [customer_id], 
          function(err, results) {
            if(err) {
              reject(err);
             // connection.end();
            }
            else if(results.length > 0 ) {
                console.log(results);
                resolve(results[0].customerID);
               // connection.end();
              
              
            }
            else {
              //connection.end();
              callback(close(intent.sessionAttributes, 'Fulfilled', {
                'contentType': 'PlainText',
                'content':
                     `You dont have an active booking. If this is a misunderstanding please call us at 1234567890.`}));
            }
          });
        });
      }
      )
      .then( // Handle success of sql connection
          (customer_id) => {
            // This is promise chaining. Return promise from inside promise.
            return new Promise((resolve, reject) => {
              gen_nanoid = ids();
              updateDynamo(slots, customer_id, gen_nanoid, function(err, content2) {
                if (err) {
                  reject(err);
                } else {
                  resolve({'content': content2, 'gen_nanoid': gen_nanoid});
                }
              });
            });
          },
        // Handle failure of fetch ID
          (err) => {
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Error.'}));
          })
      .then(
          // Handle success of updateDynamo
          (obj) => {
            if (obj.content.statusCode == '200') {
                console.log("here");
              console.log(obj.gen_nanoid);
              return new Promise((resolve, reject) => {
                var params = {
                  Message: `Your request number for cab is ${obj.gen_nanoid} for future reference. Soon someone will reach out to you.`,
                  PhoneNumber: "+1"+slots.PhoneNum,
                  Subject: 'Cab booking Confirmation'
                };
                sns.publish(params, function(err, data) {
                  if (err) reject(err); // an error occurred
                  else     resolve(obj.gen_nanoid); 
                
              });
              });
            }
          },
          // Handle failure of updateDynamo
          (err) => {
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Sorry something went wrong with your booking. Please retry.'}));
          })
          .then((gen_nanoid) => {
            callback(close(intent.sessionAttributes, 'Fulfilled', {
                'contentType': 'PlainText',
                'content':
                     `Your request for cab is recieved and booking i d is texted to you for future reference.`}));
            
          
          });
          //});
}

async function updateDynamo(slots, customer_ID, gen_nanoid, callback2) {
  var params = {
    TableName: tableName,
    Item: {
      id: {S: gen_nanoid},
      carType: {S: slots.CarType},
      customerID: {S: customer_ID},
      phoneNum: {S: slots.PhoneNum},
      pickupdate: {S: slots.PickUpDate},
      pickuptime: {S: slots.PickUpTime},
      status: {S: 'pending'}
    }
  };

  // console.log(gen_nanoid);
  await dynamodb.putItem(params, function(err, data) {
    if (err) {
      callback2(err, null);
    } else {
      callback2(null, {statusCode: '200'});
    }
  });
}

exports.handler = (event, context, callback) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    cabBooking(event, (response) => {
        //console.log(response);
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};