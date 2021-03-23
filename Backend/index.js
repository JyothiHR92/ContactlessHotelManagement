const express = require('express')
var cors = require('cors')

const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const pool = require('./configs/dbconfig')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Handler to search the rooms
app.get('/searchHotel', (req, res) => {
    //const location = req.query.location
    const checkin = req.query.checkin
    const checkout = req.query.checkout
    const guests = req.query.guests
    const location = req.query.location
    console.log('outside')
    let query = `select r.roomID, r.roomTypeID ,rt.roomTypeName, rt.hotelId, h.hotelName from Rooms r join RoomType rt inner join Hotel h where r.roomTypeID = rt.roomTypeID  
    and rt.hotelID = h.hotelID and h.location = \'${location}\'
    and rt.maxOccupancy > \'${guests}\' and  r.roomID 
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
  const reservationID = req.query.reservationID
  const hotelID = req.query.hotelID
  const roomID = req.query.roomID
  const customerID = req.query.customerID
  const isCheckedIn = false
  const checkInDate = req.query.checkInDate
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

module.exports.handler = serverless(app)

