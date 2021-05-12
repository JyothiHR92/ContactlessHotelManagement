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
const sns = new AWS.SNS();
var connection = mysql.createConnection({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname,
  port: config.port
});


var date = new Date();


var customer_ID;
var gen_nanoid = ids();;


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




function modifyAmenityBooking(intent, callback) {
  console.log(`request received for userId=${intent.userId}, intentName=${
      intent.currentIntent.name}`);
  // const sessionAttributes = intent.sessionAttributes;
  const slots = intent.currentIntent.slots;
  //const contact_Num = parseInt(slots.PhoneNum, 10);

  var booking_date = new Date(slots.newDate + ' ' + slots.newTime + ':00');
  console.log(booking_date);
  console.log("Time", booking_date.getTime());
  if (booking_date.getTime() < date.getTime()) {
    callback(close(intent.sessionAttributes, 'Fulfilled', {
      'contentType': 'PlainText',
      'content': 'DateTime selected is in past. Please pass the future date.'
    }));
    return;
  }
  // if(slots.serviceType == 'shampoo' || slots.serviceType == 'toothpaste' || slots.serviceType == 'body wash' || slots.serviceType=='showergel') {
  //   slots.serviceType = "Toiletries";
  // }
  const promise = new Promise((resolve, reject) => {
      connection.query( 'SELECT customerID FROM AmenitiesBooking WHERE bookingID = ?', [parseInt(slots.orderID)],
      function(err, rows) {
        if (err) {
          reject(err);
        } 
          //var customer_ID = rows[0].customerID;
        else if(rows.length > 0) {
            resolve(rows[0].customerID);
            console.log(rows[0].customerID);
            //connection.end();
        }
        else {
            //connection.end();
           
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Your booking is not found. Please retry with valid booking ID sent to your phone number used at the time of booking.'}));
                //connection.end();
          }
      });

   
  });
//TODO: Check slots.date < checkOutDate
  promise
      .then((customer_id) => {
          return new Promise((resolve, reject) => {
              connection.query('SELECT contactNum from CustomerDetails where customerID = ?', 
              [customer_id], function(err, rows) {
                if (err) {
                  reject(err);
                 // connection.end();
                } 
                else if(rows.length>0) {
                  resolve({'contactNum': rows[0].contactNum, 'customer_id': customer_id});
                  console.log(rows[0].contactNum);
                  //connection.end();
                }
                else {
                  callback(close(intent.sessionAttributes, 'Fulfilled',
                  {'contentType': 'PlainText', 'content': `We are sorry but there is no ongoing booking found. You can request for ${slots.amenityType} after checking in.`}));
                  //connection.end();
                }
                
              });
            });
      })
      .then( // Handle success of sql connection
          (customer_obj) => {
            // This is promise chaining. Return promise from inside promise.
            return new Promise((resolve, reject) => {
              connection.query('SELECT hotelID from Reservations where customerID = ? AND isCheckedIn=1 AND isCheckedOut = 0', 
              [customer_obj.customer_id], function(err, rows) {
                if (err) {
                  reject(err);
                 // connection.end();
                } 
                else if(rows.length>0) {
                  resolve({'hotel_id': rows[0].hotelID, 'customer_id': customer_obj.customer_id, 'contactNum': customer_obj.contactNum});
                  console.log(rows[0].hotelID);
                  //connection.end();
                }
                else {
                  callback(close(intent.sessionAttributes, 'Fulfilled',
                  {'contentType': 'PlainText', 'content': `We are sorry but there is no ongoing booking found. You can request for ${slots.amenityType} after checking in.`}));
                  //connection.end();
                }
                
              });
            });
          },
        // Handle failure of hotelID
          (err) => {
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Something went wrong. Please retry.'}));
          })
      .then(
          // Handle success of retreiving serviceID
          
          (obj) => {
            return new Promise((resolve, reject) => {
            connection.query('Select * from Amenities where hotelId=? AND amenitiesName = ?', 
            [obj.hotel_id, slots.amenityType], function(err, rows) {
                if (err) {
                  reject(err);
                } 
                else if(rows.length >0) {
                  console.log(rows[0].amenitiesID);
                  console.log(rows[0].maxOccupancy);
                  resolve({'amenities_id': rows[0].amenitiesID, 'max_occupants': rows[0].maxOccupancy, 'hotel_id': obj.hotel_id, 'customer_id': obj.customer_id, 'contactNum': obj.contactNum});
                  
                  //connection.end();
                }
                else {
                  callback(close(intent.sessionAttributes, 'Fulfilled',
                  {'contentType': 'PlainText', 'content': `We are sorry but the hotel does not provide ${slots.amenityType} service.`}));
                 // connection.end();
                }
              });
            });
          },
 
          // Handle failure of updateDynamo
          (err) => {
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Sorry something went wrong with your booking. Please retry.'}));
          }
          )
          .then((obj1) => {
            return new Promise((resolve, reject) => {
              connection.query('Select sum(guests) AS numGuests from AmenitiesBooking where amenitiesID = ? AND bookedDate=? AND startTime=? AND isCancelled=0', 
              [obj1.amenities_id, slots.newDate, booking_date], function(err, bookedGuests) {
                  if(err) {
                      reject(err);
                      //connection.end();
                  }
                  else if(bookedGuests.length>0) {
                    console.log(obj1);
                    if(bookedGuests[0].numGuests == null) {bookedGuests[0].numGuests = 0};
                    resolve({'numGuests': bookedGuests[0].numGuests, 'max_guests': obj1.max_occupants, 'amenities_id': obj1.amenities_id, 'customer_id': obj1.customer_id, 'contactNum': obj1.contactNum })
                  }
                  
              });
            });
          },
          (err) => {
            callback(close(intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Sorry something went wrong with your booking. Please retry.'}));
          }
          )
          .then((cg) => {
            return new Promise((resolve, reject) => {
              let currGQuery=`select guests from AmenitiesBooking where bookingID = ?`;
              connection.query(currGQuery, [parseInt(slots.orderID)], function(err, currG) {
                  if(err) {
                      reject(err);
                  }
                  resolve({'currGuests': currG[0].guests, 'numGuests': cg.numGuests, 'max_guests': cg.max_guests, 'amenities_id': cg.amenities_id, 'customer_id': cg.customer_id, 'contactNum': cg.contactNum});
                  console.log('curr guests', currG[0].guests);
              })
            })
          })
          .then((obj2) => {
            return new Promise((resolve, reject) => {
               console.log(booking_date);
              var endTime = new Date(booking_date);
              endTime.setHours(endTime.getHours()+1);
              console.log(endTime);
              console.log(booking_date);
              
              
              
              let uQuery = `Update AmenitiesBooking SET guests=?, startTime=?, endTime=?, bookedDate=? where bookingID = ?`;    

              console.log('Max guests', obj2.max_guests);
              console.log('Total guests', obj2.numGuests);
              console.log('New guests', slots.newGuests);
              console.log(booking_date.toJSON().slice(0, 19).replace('T', ' '));
              console.log(endTime.toJSON().slice(0, 19).replace('T', ' '))
              console.log(parseInt(slots.orderID));
              console.log('LHS', obj2.numGuests + parseInt(slots.newGuests) - obj2.currGuests);
              if(obj2.numGuests + parseInt(slots.newGuests) - obj2.currGuests <= obj2.max_guests) {
                  connection.query(uQuery,[parseInt(slots.newGuests), booking_date.toJSON().slice(0, 19).replace('T', ' '), endTime.toJSON().slice(0, 19).replace('T', ' '), slots.newDate ,parseInt(slots.orderID)], 
                    function(err, result) {
                      console.log(uQuery);
                        if (err) {
                            reject(err);
                            //connection.end();
                        } 
                        else {
                            console.log(result.insertId);
                             var params = {
                                Message: `Your slot for ${slots.amenityType} is modified. New details are ${slots.newDate} at ${slots.newTime} for ${slots.newGuests}. `,
                                PhoneNumber: "+1"+obj2.contactNum,
                                Subject: 'Amenity modification Confirmation'
                              };
                              sns.publish(params, function(err, data) {
                                  if (err) console.log(err, err.stack); // an error occurred
                                  else    { 
                                    console.log(data); 
                                    callback(close(intent.sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': `Your request for modifying ${slots.amenityType} is received successfully.`}));
                                  }
                              });
                            //callback(close(intent.sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': `Your request for modifying ${slots.amenityType} is received successfully.`}));
                            //connection.end();
                        }
                  });
              }
              else {
                        //console.log(bookedGuests);
                      callback(close(intent.sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': `We are sorry, but currently no slot avaialble at this time. Please select another time`}));
                            //connection.end();
              }
              
          });
          }, 
          (err) => {
            callback(close(
                intent.sessionAttributes, 'Fulfilled',
                {'contentType': 'PlainText', 'content': 'Sorry something went wrong with your booking. Please retry.'}));
          }
        );
}



exports.handler = (event, context, callback) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    modifyAmenityBooking(event, (response) => {
        //console.log(response);
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};