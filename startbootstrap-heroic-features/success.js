var urlParams = new URLSearchParams(window.location.search);
var sessionId = urlParams.get('session_id');
console.log(sessionId);
var sessionData = document.getElementById('session_data');
console.log("outside", sessionStorage);
if (sessionId) {
  fetch('https://jv1jisy2ri.execute-api.us-east-1.amazonaws.com/latest/checkout-session?sessionId=' + sessionId)
    .then(function (result) {
      //console.log(result);
      return result.json();
      
    })
    .then(function (data) {
      console.log(data.session_amount);
      console.log(data.session_customer_id);
      const params = JSON.stringify({
        "price": data.session_amount,
        "customerID": data.session_customer_id,
      })
      axios.post('https://nw87o9upt0.execute-api.us-east-1.amazonaws.com/latest/updatePayment', params, {
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log("PD",response); 
      })
      .catch((error) => {
        console.log('Error:', error);
      });
      axios.post('https://nw87o9upt0.execute-api.us-east-1.amazonaws.com/latest/updateConcierge', params, {
          headers: {
          'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log("UC", response)
        })
        .catch((error) => {
          console.log('Error:', error);
        });

      axios.post('https://nw87o9upt0.execute-api.us-east-1.amazonaws.com/latest/checkout', params, {
          headers: {
          'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log("CO", response)
        })
        .catch((error) => {
          console.log('Error:', error);
        });


      console.log(sessionStorage);
      //document.querySelector('pre').textContent = sessionJSON;
    })
    .catch(function (err) {
      console.log('Error when fetching Checkout session', err);
    });




}
const getDashboard = () =>{
  event.preventDefault();
  location.href = "dashboard.html"
};

const signOut = () =>{
  console.log("sign out");
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) cognitoUser.signOut();
  sessionStorage.clear();
  location.href = "landing_page.html"
};
