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
    console.log('outside')
    let query = `select r.roomID, r.roomTypeID ,rt.roomTypeName, rt.hotelId, h.hotelName from Rooms r join RoomType rt inner join Hotel h where r.roomTypeID = rt.roomTypeID  
    and rt.hotelID = h.hotelID 
    and rt.maxOccupancy > \'${guests}\' and  r.roomID 
    not in (select r1.roomID from Rooms r1 join Reservations r2 where r1.roomID = r2.roomID 
    and  ((r2.checkInDate >= \'${checkin}\' and r2.checkInDate <= \'${checkin}\' ) 
    or (r2.checkOutDate <= \'${checkout}\' and r2.checkOutDate >= \'${checkout}\') 
    or (r2.checkInDate <= \'${checkin}\' and  r2.checkOutDate >= \'${checkout}\')) )`
    
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
  


module.exports.handler = serverless(app)

