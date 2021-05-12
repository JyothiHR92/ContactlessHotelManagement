const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
var config = require('./config.json')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
var mysql = require('mysql')
var connection = mysql.createConnection({
 	host : config.dbhost, 
	user : config.dbuser , 
	//ssl : 'Amazon RDS',
	password : config.dbpassword , 
	database : config.dbname, 
	port : config.port
})

app.get('/mybill', async(req, res) => {
    let customer= req.query.customerID;
    
    let query = `with sd (roomID, num_days) as 
                (select roomID, DATEDIFF(checkOutDate, checkInDate) from Reservations 
                where customerID = ? AND isCheckedOut=?) 
                select sd.num_days*rt.roomRate as totalAmt, rt.roomTypeName as bookingType 
                from sd, RoomType rt where rt.roomTypeID =(select r.roomTypeID from Rooms r where sd.roomID =r.roomID) 
                UNION select cb.totalAmt, cs.serviceType from ConciergeBooking cb JOIN ConciergeService cs ON cb.serviceID = cs.serviceID where cb.isPaid=0 AND cb.customerID=?`;
   
      console.log(query);
        connection.query(query, [customer, 0, customer], (err, results, fields) => {
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
          },
          data: ans,
          message: 'Bill successfully retrieved.',
        }
        res.send(response)
      })

    })
    module.exports = app;