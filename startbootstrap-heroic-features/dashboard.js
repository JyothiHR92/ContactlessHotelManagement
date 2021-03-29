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
        
        document.getElementById('checkin').innerText = 'Check-In Date:  ' + checkin[0];
        document.getElementById('checkout').innerText = 'check-out Date:  ' + checkout[0];
        document.getElementById('hotelname').innerText = 'Hotel Name:  ' + response.data.data[0].hotelName;
        document.getElementById('roomnumber').innerText = 'Room Number:  '+ response.data.data[0].roomNum;
        document.getElementById('hoteladdress').innerText = 'Hotel Address:  '+response.data.data[0].address;
        document.getElementById('hotelzipcode').innerText = 'Zipcode:  '+response.data.data[0].zipcode;
    })
    
    document.getElementById('coll').style="display:block"
    
};