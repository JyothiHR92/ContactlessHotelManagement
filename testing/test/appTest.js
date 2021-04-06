const assert = require('chai').assert;
const app = require('../app');
const axios = require('axios');

describe('App', function(){
    it('should return 5', function(){
        let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/searchHotel?checkin=2021-04-15&&checkout=2021-04-18&&guests=1&&location=SanJose';
        //res = getResults(url)
         axios.get(url)
        .then(function (response) {
            if(response.data.data.length != 0)
            {   
                //console.log(typeof(response.data.data.length))
                //return int(response.data.data.length);
                res = response.data.data.length
                //console.log('result',res)
                let result = app.search(res);
                //console.log('apptest',typeof(result))
                //console.log(result)
                assert.equal(result, 5);
                
                
            }
            
        })
        
    });

    it('should return 0', function(){
        let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/searchHotel?checkin=2021-04-15&&checkout=2021-04-18&&guests=2&&location=SanJose';
        //res = getResults(url)
         axios.get(url)
        .then(function (response) {
            if(response.data.data.length != 0)
            {   
                //console.log(typeof(response.data.data.length))
                //return int(response.data.data.length);
                res = response.data.data.length
                //console.log('result',res)
                let result = app.search(res);
                //console.log('apptest',typeof(result))
                //console.log(result)
                assert.equal(result, 0);
                
                
            }
            
        })
        
    });

    it('Reservation of room successfull', function(){
        let url =  'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/book?hotelID=3aa255f0-8d30-11eb-8dcd-0242ac130003&&roomID=1&&customerID=1fbf18cb-cfb0-4c6b-b964-416ee300c574&&checkInDate=2021-04-26&&checkOutDate=2021-04-31';
        //res = getResults(url)
         axios.post(url)
        .then(function (response) {
            if(response.data.data.length != 0)
            {   
                //console.log(typeof(response.data.data.length))
                //return int(response.data.data.length);
                res = response.data.message
                //console.log('result',res)
                let result = app.book(res);
                //console.log('apptest',typeof(result))
                //console.log(result)
                assert.equal(result, "Reservation 2268fbbf-13f2-4fde-b9e7-e3831adf90af successfully added.");
                
                
            }
            
        })
        
    });

    it('invalid customer', function(){
        let url =  'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/book?hotelID=3aa255f0-8d30-11eb-8dcd-0242ac130003&&roomID=1&&customerID=8a1096ee-db5f-42a3-b530-f0bb636b562d&&checkInDate=2021-04-26&&checkOutDate=2021-04-31';
        //res = getResults(url)
         axios.post(url)
        .then(function (response) {
            if(response.data.data.length != 0)
            {   
                res = response.data.length
                let result = app.book(res);
                assert.equal(result, 0);
                
                
            }
            
        })
        
    });

    it('invalid room', function(){
        let url =  ' https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/book?hotelID=3aa255f0-8d30-11eb-8dcd-0242ac130003&&roomID=3&&customerID=8a1096ee-db5f-42a3-b530-f0bb636b562d&&checkInDate=2021-04-26&&checkOutDate=2021-04-31'
        //res = getResults(url)
         axios.post(url)
        .then(function (response) {
            if(response.data.data.length != 0)
            {   
                res = response.data.length
                let result = app.book(res);
                assert.equal(result, 0);
                
                
            }
            
        })
        
    });

    it('cancel reservation successfully', function(){
        let url =  'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/cancelReservation?reservationID=699cb9a5-54b2-4801-9af9-b01f1bcc8fbd'
        //res = getResults(url)
         axios.delete(url)
        .then(function (response) {
            if(response.data.data.length == 0)
            {   
                res = response.data.message
                let result = app.cancel(res);
                assert.equal(result, "reservation '699cb9a5-54b2-4801-9af9-b01f1bcc8fbd'successfully cancelled.");
                
                
            }
            
        })
        
    });

    

});