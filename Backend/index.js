const express = require('express')
var cors = require('cors')

const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const pool = require('./configs/dbconfig')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
var sleep = require('system-sleep');

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
const TreeMap = require("treemap-js");
var map = new TreeMap();
// Handler to search the rooms

app.get('/searchHotel', (req, res) => {
    //const location = req.query.location
    const checkin = req.query.checkin
    const checkout = req.query.checkout
    const guests = req.query.guests
    const location = req.query.location
    console.log('outside')
    let query = `select r.roomID, r.roomTypeID ,rt.roomTypeName, rt.hotelId, h.hotelName, rt.roomRate, h.address from Rooms r join RoomType rt inner join Hotel h where r.roomTypeID = rt.roomTypeID  
    and rt.hotelID = h.hotelID and h.location = \'${location}\'
    and rt.maxOccupancy >= \'${guests}\' and  r.roomID 
    not in (select r1.roomID from Rooms r1 join Reservations r2 where r1.roomID = r2.roomID 
    and  ((r2.checkInDate >= \'${checkin}\' and r2.checkInDate <= \'${checkout}\' ) 
    or (r2.checkOutDate <= \'${checkout}\' and r2.checkOutDate >= \'${checkin}\') 
    or (r2.checkInDate <= \'${checkin}\' and  r2.checkOutDate >= \'${checkin}\')) )`
    
    console.log(query)
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response)
      }
      console.log('here')
      console.log(JSON.stringify(results))
      console.log(typeof(results))
      const ans = results
      const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        data: ans,
        message: 'All rooms successfully retrieved.',
      }
      res.send(response)
    })
  })
// Handler to post the data into customer table
app.post('/customer', (req, res) => {
  const customerID = req.query.customerID
  const customerName = req.query.customerName
  const email = req.query.email
  const address = req.query.address
  const contactNum  = req.query.contactNum
  console.log("inside lambda function for POST customer")
  let query = `INSERT INTO CustomerDetails (customerID, customerName, email, address, contactNum) VALUES ('${customerID}', '${customerName}', '${email}', '${address}', '${contactNum}')`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      return res.send(response)
      
    }
    console.log(results)
    const id = results.insertId;
    const customer = {  customerID, customerName, email, address, contactNum }
    const response = {
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      data: customer,
      message: `Customer ${customerID} successfully added.`,
    }
    return res.status(201).send(response);
  })
})

//Handler to Post the data into Reservation table
app.post('/book', (req, res) => {
  const reservationID = uuidv4();
  const hotelID = req.query.hotelID
  const roomID = req.query.roomID
  const customerID = req.query.customerID
  const isCheckedIn = false
  const checkInDate = req.query.checkInDate
  //checkInDate = moment(checkInDate).format('YYYY-MM-DD HH:mm:ss');
  //const t = "14:00"
  const extraBed = 0
  const isCheckedOut = false
  const checkOutDate = req.query.checkOutDate
  console.log("inside lambda function for POST reservations")
  let query = `INSERT INTO Reservations(reservationID, hotelID, roomID, customerID, extraBed, isCheckedIn, checkInDate, isCheckedOut, checkOutDate) VALUES ('${reservationID}', '${hotelID}', '${roomID}', '${customerID}', '${extraBed}','${isCheckedIn}','${checkInDate}','${isCheckedOut}','${checkOutDate}')`
  console.log(query)
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      return res.send(response)
      
    }
    console.log(results)
    const id = results.insertId;
    const reservation = { reservationID, hotelID, roomID, customerID, extraBed, isCheckedIn, checkInDate, isCheckedOut, checkOutDate }
    const response = {
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      data: reservation,
      message: `Reservation ${reservationID} successfully added.`,
    }
    return res.status(201).send(response);
  })
})

prev_hotelid = ""
prev_roomid = ""
app.post('/Postbook', (req, res) => {
  const reservationID = uuidv4();
  const hotelID = req.query.hotelID
  const roomID = req.query.roomID
  const customerID = req.query.customerID
  const isCheckedIn = false
  const checkInDate = req.query.checkInDate
  //checkInDate = moment(checkInDate).format('YYYY-MM-DD HH:mm:ss');
  //const t = "14:00"
  const extraBed = 0
  const isCheckedOut = false
  const checkOutDate = req.query.checkOutDate

  var current_time = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(current_time)
  console.log(typeof(current_time))
  //current_time = moment(current_time)
  console.log(current_time)
  
  //TreeMap datastructure to maintain concurrancy
  //var map = new TreeMap();
  map.set(current_time, [ reservationID, hotelID, roomID, customerID,extraBed,isCheckedIn,checkInDate, isCheckedOut, checkOutDate ])
  
  while(map.getLength() != 0)
  {
  const k = map.getMinKey();

  let values = map.get(k); 
  console.log(values)
  if(((prev_hotelid == values[1]) && (prev_roomid != values[2])) || ((prev_hotelid!=values[1]) && (prev_roomid == values[2])) || ((prev_hotelid != values[1]) && (prev_roomid != values[1])))
  {
    console.log("inside lambda function for POST reservations")
    let q = `LOCK TABLES Reservations WRITE`
    console.log(q)
    pool.query(q, (err, results, fields) => {
      console.log("here in lock",results);
      let query = `INSERT INTO Reservations(reservationID, hotelID, roomID, customerID, extraBed, isCheckedIn, checkInDate, isCheckedOut, checkOutDate) VALUES ('${values[0]}', '${values[1]}', '${values[2]}', '${values[3]}', '${values[4]}','${values[5]}','${values[6]}','${values[7]}','${values[8]}')`
      console.log(query)
      sleep(5000)
      pool.query(query, (err, results, fields) => {
        if (err) {
          const response = { data: null, message: "The room is not available, kindly book another room", }
          return res.send(response)
        }
        console.log(results)
        
      })
      const reservation = { reservationID, hotelID, roomID, customerID, extraBed, isCheckedIn, checkInDate, isCheckedOut, checkOutDate }
      const response = {
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
          //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        data: reservation,
        message: `Reservation ${reservationID} successfully added.`
      }
      prev_room_id = values[1]
      prev_hotelid =values[2]
      map.remove(k)
      return res.status(201).send(response);
    })
  }
  else
  {
  const booked_response = {
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
      //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    data: null,
    message: "The room is not available, kindly book another room"
  }
  prev_room_id = values[1]
  prev_hotelid =values[2]
  map.remove(k)
  return res.status(201).send(booked_response)
  }
      prev_room_id = values[1]
      prev_hotelid =values[2]
      map.remove(k)
  }
})

//Handler to get the Reservation details of the user
app.get('/getReservation', (req, res) => {
  //const location = req.query.location
  const cust_id = req.query.customer_id
  
  console.log('inside get reservation')
  let query = `select r.checkInDate, r.checkOutDate, r.reservationID,r.roomID, rm.roomNum,rt.roomTypeName, h.hotelName,h.address,h.location,h.zipcode,r.isCheckedIn,r.isCheckedOut from Reservations r
  inner join Rooms rm inner join RoomType rt inner join Hotel h
   where r.roomID = rm.roomID and rm.roomTypeID = rt.roomTypeID
   and r.hotelID = h.hotelID
   and r.customerID = \'${cust_id}\' and r.isCheckedOut = false  ORDER BY r.checkInDate ASC`;
  console.log(query)
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }
    console.log('here')
    console.log(JSON.stringify(results))
    console.log(typeof(results))
    const ans = results
    const response = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      data: ans,
      message: 'reservation successfully retrieved.',
    }
    res.send(response)
  })
})

//delete the reservation by reservation ID
app.delete('/cancelReservation', (req, res) => {
  //const location = req.query.location
  const res_id = req.query.reservationID
  
  console.log('inside delete reservation')
  let query = `delete from Reservations where reservationID=\'${res_id}\'`;
  console.log(query)
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }
    console.log('here')
    console.log(JSON.stringify(results))
    console.log(typeof(results))
    const ans = results
    const response = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
          //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      data: null,
      message: `reservation \'${res_id}\'successfully cancelled.`,
    }
    res.send(response)
  })
})

//get customer details
app.get('/getCustomerDetails', (req, res) => {
  //const location = req.query.location
  const cust_id = req.query.customer_id
  
  console.log('inside get customer')
  let query = `select * from CustomerDetails where customerID=\'${cust_id}\'`;
  console.log(query)
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }
    console.log('here')
    console.log(JSON.stringify(results))
    console.log(typeof(results))
    const ans = results
    const response = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
          //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      data: ans,
      message: 'customer details successfully retrieved.',
    }
    res.send(response)
  })
})

//update customer details
app.put('/updateCustomer', (req, res) => {
  const cust_id = req.query.customerID
  const cust_name = req.query.customerName
  const email = req.query.email
  const address = req.query.address
  const contact = req.query.contact
  
  
    
  let query = `UPDATE CustomerDetails SET customerName='${cust_name}', email='${email}', address='${address}', contactNum='${contact}' WHERE customerID='${cust_id}'`
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response)
      }

      const data = {
        cust_id,
        cust_name,
        email,
        address,
        contact,
      }
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
          //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        data: data,
        message: `customer ${cust_name} is successfully updated.`,
      }
      res.send(response)
  })
});

//get the count of rows to check the extension of the stay
app.get('/getCountRows', (req, res) => {
  //const location = req.query.location
  const reservationID = req.query.reservationID
  const roomID = req.query.roomID
  const extended_checkout = req.query.extended_checkout
  const current_startdate = req.query.current_startdate
  
  console.log('inside get customer')
  let query =  `select count(*) as rcount from Reservations where reservationID != \'${reservationID}\' and roomID = \'${roomID}\'
  and \'${extended_checkout}\' > checkInDate and checkIndate > \'${current_startdate}\'`;
  console.log(query)
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }
    console.log('here')
    console.log(JSON.stringify(results))
    console.log(typeof(results))
    const ans = results
    const response = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      data: ans,
      message: 'rows successfully retrieved.',
    }
    res.send(response)
  })
})

//update the checkoutdate to extend the stay of the user
app.put('/updateCheckout', (req, res) => {
  const reservationID = req.query.reservationID
  const extended_checkout = req.query.extended_checkout
  let query = `UPDATE Reservations SET checkOutDate='${extended_checkout}'WHERE reservationID='${reservationID}'`
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response)
      }

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
          //"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        
        message: `checkout date for ${reservationID} is successfully updated.`,
      }
      res.send(response)
  })
});

module.exports.handler = serverless(app)

