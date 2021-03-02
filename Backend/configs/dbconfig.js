const mysql = require('mysql')
const pool  = mysql.createPool({
  host            : '',
  user            : 'admin',
  password        : 'rootadmin',
  database        : 'ContactlessHotelManagementSystem',
  port            : 3306,
  ssl             : true
})

module.exports = pool