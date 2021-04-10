
//Save user details to customer database
const saveReservation = () => {
 
  
  event.preventDefault();
  getUserAttributes();
  
 };

function getUserAttributes(){
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  let cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {

          cognitoUser.getUserAttributes(function(err, result) {
              if (err) {
                  console.log(err);
                  return;
              }
              for (let i = 0; i < result.length; i++) {
                  console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
                  sessionStorage.setItem(result[i].getName(), result[i].getValue())
                  console.log(sessionStorage)
              }
              let cname =document.getElementById('fname').value
              let email = document.getElementById('email').value
              let street = document.getElementById('street').value
              let contact_number = document.getElementById('contactnumber').value
            
              console.log('cust_name' + cname)
              let cid = sessionStorage.getItem('sub')
              sessionStorage.setItem('username',cname)
              let address = street.split(" ")
              console.log('address =' + address)
              let addr = address.join("+")
              console.log(addr)
              let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/customer?customerID='+cid+'&&customerName='+cname+'&&email='+email+'&&address='+addr+'&&contactNum='+contact_number;
              console.log(url)
              axios.post(url)
                .then(function (response) {
                  //resultElement.innerHTML = generateSuccessHTMLOutput(response);
                  console.log(response)
                  console.log('here')
                  console.log(window.location.href)
                  location.href = "reserve.html"
                  alert('Data saved successfully')
                })
              .catch(function (error) {
                console.log(error)
              });
             
            });
          });
        }

}


//Book and payment
const book= () => { 
  event.preventDefault();
  getCurrentUser();
}

function getCurrentUser() {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  let cognitoUser = userPool.getCurrentUser();
 
  console.log('inside book function')
  if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {

        cognitoUser.getUserAttributes(function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            for (let i = 0; i < result.length; i++) {
                console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
                sessionStorage.setItem(result[i].getName(), result[i].getValue())
                console.log(sessionStorage)
            }
            let hotel_id = sessionStorage.getItem('hotel_id')
            let room_id = sessionStorage.getItem('room_id')
            let customer_id = sessionStorage.getItem('sub')
            let checkin = sessionStorage.getItem('checkin')
            let checkout = sessionStorage.getItem('checkout')
            let price = sessionStorage.getItem('roomRate')
            //var stripe = Stripe(stripekey.STRIPE_PUB_KEY);
            //let h_id = localStorage.setItem('hotel_id',sessionStorage.getItem('hotel_id'))
            //let r_id = localStorage.setItem('room_id',sessionStorage.getItem('room_id'))
            let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/book?hotelID='+hotel_id+'&&roomID='+room_id+'&&customerID='+customer_id+'&&checkInDate='+checkin+'&&checkOutDate='+checkout;
              console.log(url)
              axios.post(url)
                .then(function (response) {
                  //resultElement.innerHTML = generateSuccessHTMLOutput(response);
                  console.log(response)
                  console.log('here in post of reservation')
                  console.log(window.location.href)
                  location.href = "dashboard.html"
                  alert('Booked room successfully')
                })
              .catch((error) => {
            console.error('Error:', error);
          });
            
        });
      });
  }
}

//Customer Login without Registeration
const signInUser = () => {
  event.preventDefault();
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
  const username = document.getElementById("signinusername").value;
  const password = document.getElementById("passwordforsignin").value;

  let authenticationData = {
    Username: username,
    Password: password,
  };

  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  var userData = {
    Username: username,
    Pool: userPool,
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function () {
      console.log("login success");
      console.log(cognitoUser)
      console.log(userData.Username)
      sessionStorage.setItem('username',userData.Username)
      getCurrentUserForDisplay();
      
    },
    onFailure: function (err) {
      alert(JSON.stringify(err));
    },
  });
};

function getCurrentUserForDisplay() {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  let cognitoUser = userPool.getCurrentUser();
 
  console.log('inside getcurrentuserfordiaplay function')
  if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {

        cognitoUser.getUserAttributes(function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            for (let i = 0; i < result.length; i++) {
                console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
                sessionStorage.setItem(result[i].getName(), result[i].getValue())
                console.log(sessionStorage)
            }
            location.href = "reserve.html"
          });
      });
  }
}
 
