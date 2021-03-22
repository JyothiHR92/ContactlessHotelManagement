
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

 
