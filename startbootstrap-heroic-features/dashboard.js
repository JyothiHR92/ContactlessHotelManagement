//get the menu option for user dashboard
const getMenu = () => {
    customer_id = sessionStorage.getItem('sub')
    console.log('customer id' + customer_id)
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getReservation?customer_id='+customer_id;
    console.log(url)
    axios.get(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in get of reservation')
        checkin = response.data.data[0].checkInDate
        checkin = checkin.split('T')
        checkout = response.data.data[0].checkOutDate
        checkout = checkout.split('T')

        sessionStorage.setItem('checkin',checkin[0])
        sessionStorage.setItem('checkout',checkout[0])
        sessionStorage.setItem('res_id', response.data.data[0].reservationID)
        
        document.getElementById('checkin').innerText = 'Check-In Date:  ' + checkin[0];
        document.getElementById('checkout').innerText = 'check-out Date:  ' + checkout[0];
        document.getElementById('hotelname').innerText = 'Hotel Name:  ' + response.data.data[0].hotelName;
        document.getElementById('roomnumber').innerText = 'Room Number:  '+ response.data.data[0].roomNum;
        document.getElementById('hoteladdress').innerText = 'Hotel Address:  '+response.data.data[0].address;
        document.getElementById('hotelzipcode').innerText = 'Zipcode:  '+response.data.data[0].zipcode;
    })
    
    document.getElementById('coll').style="display:block"
    
};

//cancel reservation 
const cancelReservation = () => {
    console.log(new Date())
    var date_s = sessionStorage.getItem('checkin');
    let dateStr = date_s,
    timeStr = '14:00',
    date    = moment(dateStr),
    time    = moment(timeStr, 'HH:mm');

    date.set({
    hour:   time.get('hour'),
    minute: time.get('minute'),
    second: time.get('second')
    });
    //using moment.js to convert the time into moment local format and to check the difference between the current time and check in time
    console.log(date);
    end = moment(date).format('YYYY-MM-DD HH:mm:ss');
    var current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(current_time)
    console.log(typeof(current_time))
    current_time = moment(current_time)
    end = moment(end)
    console.log(typeof(current_time))
    var duration = moment.duration(end.diff(current_time));
    var hours = duration.asHours();
    console.log(hours)
    if(hours > 24)
    {
        alert('Your amount will be refunded within 7 days')
        const res_id = sessionStorage.getItem('res_id')
        let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/cancelReservation?reservationID='+res_id;
        console.log(url)
        axios.delete(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in cancel reservation of more than 24 hrs')
        alert('Your booking cancelled successfully')
        })
        .catch(function (error) {
            //resultElement.innerHTML = generateErrorHTMLOutput(error);
            console.log(JSON.stringify(error))
        });
    
    }
    else{
        alert('10 percent will be deducted from the total payed amount')
        const res_id = sessionStorage.getItem('res_id')
        let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/cancelReservation?reservationID='+res_id;
        console.log(url)
        axios.delete(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in cancel reservation less than 24 hrs')
        alert('Your booking cancelled successfully')
        })
        .catch(function (error) {
            //resultElement.innerHTML = generateErrorHTMLOutput(error);
            console.log(JSON.stringify(error))
        });

    }
};