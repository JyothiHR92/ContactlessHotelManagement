//onload check for the isheckedIn to enable amenities and bot

document.getElementById("yourstay").addEventListener("load", myFunction);

function myFunction() {
    console.log('myfuntion')
    customer_id = sessionStorage.getItem('sub')
    console.log('customer id' + customer_id)
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getReservation?customer_id='+customer_id;
    console.log(url)
    axios.get(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in get of reservation')
       if(response.data.data[0].isCheckedIn == 1 && response.data.data[0].isCheckedOut == 0){
            document.getElementById('cancelres').style="display:none"
            document.getElementById('checkinbutton').style="display:none"
            document.getElementById('servicebutton').style="display:none"
            document.getElementById('yourstay').style="display:block"
            document.getElementById('bot').style="display:block"
        }
        else{
            document.getElementById('cancelres').style="display:block"
            document.getElementById('yourstay').style="display:none"
            document.getElementById('bot').style="display:none"
        
        }
    })
};

const checkIn = () =>{
    document.getElementById('modalb').innerText = sessionStorage.getItem('res_id')
};
//onclick of close for the checkin it has to check for the isCheckedIn and enable yourstay and bot button
const enableServices = () =>{
    console.log('close function')
    customer_id = sessionStorage.getItem('sub')
    console.log('customer id' + customer_id)
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getReservation?customer_id='+customer_id;
    console.log(url)
    axios.get(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in get of reservation')
       if(response.data.data[0].isCheckedIn == 1 && response.data.data[0].isCheckedOut == 0){
            document.getElementById('yourstay').style="display:block"
            document.getElementById('bot').style="display:block"
            //alert('You can avail the services offered ny the hotel')
            document.getElementById('alertsuccess').style="display:block;"
            document.getElementById('alertsuccess').innerText = 'You can avail the services offered by the hotel'
        }
        else
        {
            console.log("enable services failure")
            //alert('you have to check-in to avail the services')
            document.getElementById('alertfailure').style="display:block;"
            document.getElementById('alertfailure').innerText = 'You have to checkin to avail the services offered by the hotel.'
        }
    })
};

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
        if(response.data.data.length != 0 )
        {
        checkin = response.data.data[0].checkInDate
        checkin = checkin.split('T')
        checkout = response.data.data[0].checkOutDate
        checkout = checkout.split('T')

        sessionStorage.setItem('checkin',checkin[0])
        sessionStorage.setItem('checkout',checkout[0])
        sessionStorage.setItem('res_id', response.data.data[0].reservationID)
        sessionStorage.setItem('room_id', response.data.data[0].roomID)
        
        /*if(response.data.data[0].isCheckedIn == 1){
            document.getElementById('yourstay').style="display:block"
            document.getElementById('bot').style="display:block"
        }*/
        
        document.getElementById('checkin').innerText = 'Checkin Date:  ' + checkin[0];
        document.getElementById('checkout').innerText = 'checkout Date:  ' + checkout[0];
        document.getElementById('hotelname').innerText = 'Hotel Name:  ' + response.data.data[0].hotelName;
        document.getElementById('roomnumber').innerText = 'Room Number:  '+ response.data.data[0].roomNum;
        document.getElementById('hoteladdress').innerText = 'Hotel Address:  '+response.data.data[0].address;
        document.getElementById('hotelzipcode').innerText = 'Zipcode:  '+response.data.data[0].zipcode;
        } 
        else{
            document.getElementById('viewreservation').style="display:none";
            document.getElementById('cancelres').style="display:none";
            document.getElementById('checkinbutton').style = "display:none";
            document.getElementById('servicebutton').style="display:none";
            document.getElementById('extendcheckout').style="display:none"
            document.getElementById('viewblankrecords').style="display:block";
            document.getElementById('displaymessage').innerText='No reservations found.'
        }  
    })

    let link = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getCustomerDetails?customer_id='+customer_id;
    console.log(link)
    axios.get(link)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in get of customer')
        document.getElementById('cname').innerText = 'Name:  '+response.data.data[0].customerName
        document.getElementById('email').innerText = 'Email:  '+response.data.data[0].email
        document.getElementById('mail').innerText = 'Mailing Address:  '+response.data.data[0].address
        document.getElementById('phno').innerText = 'Phone Number:  '+response.data.data[0].contactNum
        document.getElementById('cust_name').value = response.data.data[0].customerName
        document.getElementById('e_address').value = response.data.data[0].email
        document.getElementById('m_address').value = response.data.data[0].address
        document.getElementById('c_number').value =  response.data.data[0].contactNum
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
        //alert('Your amount will be refunded within 7 days')
        const res_id = sessionStorage.getItem('res_id')
        let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/cancelReservation?reservationID='+res_id;
        console.log(url)
        axios.delete(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in cancel reservation of more than 24 hrs')
        //alert('Your booking cancelled successfully')
        document.getElementById('modalbody').innerHTML = 'Cancelled Room Successfully!!'
        })
        .catch(function (error) {
            //resultElement.innerHTML = generateErrorHTMLOutput(error);
            console.log(JSON.stringify(error))
        });
    
    }
    else{
        //alert('10 percent will be deducted from the total payed amount')
        const res_id = sessionStorage.getItem('res_id')
        let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/cancelReservation?reservationID='+res_id;
        console.log(url)
        axios.delete(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in cancel reservation less than 24 hrs')
        //alert('Your booking cancelled successfully')
        document.getElementById('modalbody').innerHTML = 'Cancelled Room Successfully!!'
        })
        .catch(function (error) {
            //resultElement.innerHTML = generateErrorHTMLOutput(error);
            console.log(JSON.stringify(error))
        });

    }
    customer_id = sessionStorage.getItem('sub')
    console.log('customer id' + customer_id)
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getReservation?customer_id='+customer_id;
    console.log(url)
    axios.get(url)
        .then(function (response) {
            console.log(response)
        if(response.data.data.length != 0)
        {
        console.log('here in get of reservation')
        checkin = response.data.data[0].checkInDate
        checkin = checkin.split('T')
        checkout = response.data.data[0].checkOutDate
        checkout = checkout.split('T')

        sessionStorage.setItem('checkin',checkin[0])
        sessionStorage.setItem('checkout',checkout[0])
        sessionStorage.setItem('res_id', response.data.data[0].reservationID)
        sessionStorage.setItem('room_id', response.data.data[0].roomID)
        
        document.getElementById('checkin').innerText = 'Checkin:  ' + checkin[0];
        document.getElementById('checkout').innerText = 'checkout:  ' + checkout[0];
        document.getElementById('hotelname').innerText = 'Hotel Name:  ' + response.data.data[0].hotelName;
        document.getElementById('roomnumber').innerText = 'Room Number:  '+ response.data.data[0].roomNum;
        document.getElementById('hoteladdress').innerText = 'Hotel Address:  '+response.data.data[0].address;
        document.getElementById('hotelzipcode').innerText = 'Zipcode:  '+response.data.data[0].zipcode;
        }
        else{
            document.getElementById('viewreservation').style="display:none";
            document.getElementById('cancelres').style="display:none";
            document.getElementById('extendcheckout').style="display:none"
            document.getElementById('viewblankrecords').style="display:block";
            document.getElementById('displaymessage').innerText='No reservations found.'
        }
        })
};

//Update Customer details
const updateCustomer = () =>{
    const customerID = sessionStorage.getItem('sub')
    console.log(customerID)
    const customerName = document.getElementById('cust_name').value
    const email = document.getElementById('e_address').value
    let address= document.getElementById('m_address').value
    const contact = document.getElementById('c_number').value
    console.log(customerName)
    console.log(email)
    console.log(address)
    console.log(contact)
    address = address.split(" ")
    console.log('address =' + address)
    address = address.join("+")
    console.log(address)
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/updateCustomer?customerID='+customerID+'&&customerName='+customerName+'&&email='+email+'&&address='+address+'&&contact='+contact
    console.log(url)
    axios.put(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in updating the customer details')
        let link = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getCustomerDetails?customer_id='+customerID;
        console.log(link)
        if (response.data.data.length !=0 )
        {   console.log('inside if')
            axios.get(link)
            .then(function(res) {
                consile.log(res)
                console.log('here in get of the customer details')
                document.getElementById('cname').innerText = 'Name:  '+res.data.data[0].customerName
                document.getElementById('email').innerText = 'Email:  '+res.data.data[0].email
                document.getElementById('mail').innerText = 'Mailing Address:  '+res.data.data[0].address
                document.getElementById('phno').innerText = 'Phone Number:  '+res.data.data[0].contactNum
                console.log("customer data retrieved successfully")
            })
            .catch(function (error) {
                console.log(JSON.stringify(error))
            });
        }
        //alert('Details saved successfully')
        document.getElementById('alertupdate').style="display:block";
        document.getElementById('alertupdate').innerText='Updated details successfully!!'
        })
        .catch(function (error) {
            //resultElement.innerHTML = generateErrorHTMLOutput(error);
            console.log(JSON.stringify(error))
    });
};

//retreive customer details
const retreiveCustomer = ()=>{
    const customerID = sessionStorage.getItem('sub')
    let link = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getCustomerDetails?customer_id='+customerID;
    console.log(link)
    axios.get(link)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in get of customer')
        document.getElementById('cname').innerText = 'Name:  '+response.data.data[0].customerName
        document.getElementById('email').innerText = 'Email:  '+response.data.data[0].email
        document.getElementById('mail').innerText = 'Mailing Address:  '+response.data.data[0].address
        document.getElementById('phno').innerText = 'Phone Number:  '+response.data.data[0].contactNum
       
    }).catch(function (error){
        console.log(JSON.stringify(error))
    });
};

//Extend customer stay
const updateCheckOut = () =>{
    extended_checkout = document.getElementById('datepickerto').value
    console.log(extended_checkout)
    reservationID = sessionStorage.getItem('res_id')
    current_startdate = sessionStorage.getItem('checkin')
    roomID = sessionStorage.getItem('room_id')
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getCountRows?reservationID='+reservationID+'&&roomID='+roomID+'&&extended_checkout='+extended_checkout+'&&current_startdate='+current_startdate
    console.log('url')
    axios.get(url)
    .then(function (response) {
    //resultElement.innerHTML = generateSuccessHTMLOutput(response);
    console.log(response)
    console.log('here in get of getCountRows')
    //call update checkout api
    if (response.data.data[0].rcount == 0){
        let link = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/updateCheckout?reservationID='+reservationID+'&&extended_checkout='+extended_checkout
        console.log(link)
        axios.put(link)
        .then(function (response) {
            console.log(response)
            console.log('updated checkout successfully')
            //alert('Extetended Your Stay Successfully')
            document.getElementById('alert').style="display:block";
            document.getElementById('alert').innerText = "Extended your checkout date successfully."
        })
    }
    else{
            //alert('Sorry, room is not available. Kindly book another room')
            document.getElementById('alert').style="display:block";
            document.getElementById('alert').innerText = "Sorry, room is not available. Kindly book another room."
        }
    })
    .catch(function (error){
    console.log(JSON.stringify(error))
    });
};

//get updated checkout from reservation table 
const retreiveReservation = () =>{
    console.log('inside retreive reservation')
    customer_id = sessionStorage.getItem('sub')
    console.log('customer id' + customer_id)
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/getReservation?customer_id='+customer_id;
    console.log(url)
    axios.get(url)
        .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        console.log('here in get of reservation')
        if (response.data.data.length != 0)
        {
        checkin = response.data.data[0].checkInDate
        checkin = checkin.split('T')
        checkout = response.data.data[0].checkOutDate
        checkout = checkout.split('T')
        sessionStorage.setItem('checkout',checkout[0])

        document.getElementById('checkin').innerText = 'Checkin:  ' + checkin[0];
        document.getElementById('checkout').innerText = 'checkout:  ' + checkout[0];
        document.getElementById('hotelname').innerText = 'Hotel Name:  ' + response.data.data[0].hotelName;
        document.getElementById('roomnumber').innerText = 'Room Number:  '+ response.data.data[0].roomNum;
        document.getElementById('hoteladdress').innerText = 'Hotel Address:  '+response.data.data[0].address;
        document.getElementById('hotelzipcode').innerText = 'Zipcode:  '+response.data.data[0].zipcode;
        }
        else{
            document.getElementById('viewreservation').style="display:none";
            document.getElementById('cancelres').style="display:none";
            document.getElementById('extendcheckout').style="display:none"
            document.getElementById('checkinbutton').style="display:none"
            document.getElementById('servicebutton').style="display:none"
            document.getElementById('viewblankrecords').style="display:block";
            document.getElementById('displaymessage').innerText='No reservations found.'
        }
       
    }).catch(function (error){
        console.log(JSON.stringify(error))
    });
    
};

//signout implementation
const signOut = () =>{
    console.log("sign out");
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) cognitoUser.signOut();
    sessionStorage.clear();
    location.href = "landing_page.html"
};