'use strict';
console.log('Loading event');
//const generate = require('nanoid/generate');
//const nanoid_lc  = require('nanoid-dictionary/lowercase');

var AWS = require('aws-sdk');
var mysql = require('mysql');
var config = require('./config.json');

const sns = new AWS.SNS();
const ses = new AWS.SES();

var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname,
  port: config.port
});



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




function roomServiceBooking(intent, callback) {
  console.log(`request received for userId=${intent.userId}, intentName=${
      intent.currentIntent.name}`);
  // const sessionAttributes = intent.sessionAttributes;
  const slots = intent.currentIntent.slots;
  const contact_Num = parseInt(slots.PhoneNum, 10);

  if(slots.serviceType == 'shampoo' || slots.serviceType == 'toothpaste' || slots.serviceType == 'body wash' || slots.serviceType=='showergel') {
    slots.serviceType = "Toiletries";
  }
  const promise = new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
       if(err) throw err;
     // console.log("Database Connected!");
      let query = `select customerName, customerID from CustomerDetails where contactNum=?`;
      connection.query(query, [contact_Num],
      function(err, rows) {
        if (err) {
          reject(err);
        } 
          //var customer_ID = rows[0].customerID;
        else if(rows.length > 0) {
          console.log(rows[0].customerName, rows[0].customerID);
            resolve({'customerName': rows[0].customerName, 'customer_id': rows[0].customerID});
            //console.log('here',rows[0].roomNum);
            //connection.release();
             
        }
        else {
            //pool.end();
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Your booking is not found. Please retry with phone number used at the time of booking.'}));
                //connection.end();
          }
      });
    });
   
  });

    promise
          .then((customer_obj) => {
            return new Promise((resolve, reject) => {
              pool.getConnection(function(err, connection) {
                if(err) throw err;
                console.log("Database Connected!");
                let query1 = `Select hotelName from Hotel where hotelID = 
                    (select hotelID from Reservations where customerID = ? 
                    AND isCheckedIn = 1 and isCheckedOut = 0)`;
                connection.query(query1, [customer_obj.customer_id],
                function(err, rows) {
                  if (err) {
                    reject(err);
                  } 
                    //var customer_ID = rows[0].customerID;
                  else if(rows.length > 0) {
                    console.log('here',rows[0].hotelName);
                    resolve({'hotelName':rows[0].hotelName, 'customerName': customer_obj.customerName, 'customer_id': customer_obj.customer_id});
                      //console.log('here',rows[0].roomNum);
                      //connection.release();
                       
                  }
                  else {
                      //pool.end();
                      callback(close(
                          intent.sessionAttributes, 'Fulfilled',
                          {'contentType': 'PlainText', 'content': 'Your booking is not found. Please retry with phone number used at the time of booking.'}));
                          //connection.end();
                    }
                });
              });
            })
          })
          .then((hotel_obj) => {
            return new Promise((resolve, reject) => {
              pool.getConnection(function(err, connection) {
                if(err) throw err;
                //console.log("Database Connected!");
                let query2 = `Select roomNum from Rooms where roomID = 
                    (select roomID from Reservations where customerID = ?
                    AND isCheckedIn = 1 and isCheckedOut = 0)`;
                connection.query(query2, [hotel_obj.customer_id],
                function(err, rows) {
        
                  if (err) {
                    reject(err);
                  } 
                    //var customer_ID = rows[0].customerID;
                  else if(rows.length > 0) {
                    console.log('here',rows[0].roomNum);
                    resolve({'roomNum':rows[0].roomNum, 'hotelName': hotel_obj.hotelName, 'customerName': hotel_obj.customerName, 'customer_id': hotel_obj.customer_id});
                      //console.log('here',rows[0].roomNum);
                      //connection.release();
                       
                  }
                  else {
                      //pool.end();
                      callback(close(
                          intent.sessionAttributes, 'Fulfilled',
                          {'contentType': 'PlainText', 'content': 'Your booking is not found. Please retry with phone number used at the time of booking.'}));
                          //connection.end();
                    }
                });
              });
            })
          })
          .then((obj) => {
                  //connection.release();
                  let params = {
                            Source: 'paimanz@gmail.com',
                            Destination: {
                              ToAddresses: [
                                'paimanz@gmail.com'
                              ],
                            },
                            ReplyToAddresses: ['paimanz@gmail.com'],
                            Message: {
                              Body: {
                                Html: {
                                  Charset: 'UTF-8',
                                  Data: `<html><body> <b> House Keeping Request <br> Extra ${slots.serviceType} needed <br> Customer ${obj.customerName} Room Number <strong>${obj.roomNum}</strong></body></html>` ,
                                },
                              },
                              Subject: {
                                Charset: 'UTF-8',
                                Data: `${obj.hotelName} - House Keeping Request for Customer ${obj.customerName} at Room Number ${obj.roomNum}`,
                              }
                            },
                  };
                  return new Promise((resolve, reject) => {
                    ses.sendEmail(params, function(err, sesData) {
                      if(err) reject(err);
                      else resolve(sesData);
                    });
                  });
          })
          .then((sesData) => {
            console.log("SES", sesData.MessageId);
            if(sesData.MessageId != null) {
              
              var sns_params = {
                Message: `Your request number for ${slots.serviceType} is recieved and text message is sent Soon someone will reach out to you.`,
                PhoneNumber: "+1"+slots.PhoneNum,
                Subject: 'Room Service booking Confirmation'
                  };
                return new Promise((resolve, reject) => {
                  sns.publish(sns_params, function(err, snsData) {
                    if (err) reject (err); // an error occurred
                    else     resolve(snsData); 
                  });
                });
            }
          })
          .then((snsData) => {
            console.log("SNS", snsData.MessageId);
            callback(close(intent.sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': 
                 `Your request for ${slots.serviceType} is received successfully. You will recieve a confirmation text message for future reference.`}));
          })
          // (err) => {
          //   callback(close(
          //       intent.sessionAttributes, 'Fulfilled',
          //       {'contentType': 'PlainText', 'content': 'Sorry something went wrong with your booking. Please retry.'}));
          // }
          .catch((err) => {
            //throw err;
            callback(close(
                 intent.sessionAttributes, 'Fulfilled',
                 {'contentType': 'PlainText', 'content': 'Sorry something went wrong with your booking. Please retry.'}));
          });
}



exports.handler = (event, context, callback) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    roomServiceBooking(event, (response) => {
        //console.log(response);
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};