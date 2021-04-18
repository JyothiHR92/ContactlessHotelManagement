//redirecting to search page from the landing page
const searchHotels = () => {
    event.preventDefault();
    location.href = "search.html"
};

//redirecting to login form in the landing page
const landingLogin = () => {
    event.preventDefault();
    document.getElementById("landing_login").style="display:block;"
};

//Handle login from the landing page
const landLogin = () => {
    event.preventDefault();
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
    const username = document.getElementById("landingusername").value;
    const password = document.getElementById("landing_pswd").value;
    console.log(username)
  
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
                  console.log(sessionStorage.getItem('sub'))
              }
              
              location.href = "dashboard.html"
            });
        });
    }
  }

  //redirect to admin dashboard
  const adminDashboard =  () =>
  {
    event.preventDefault();
    location.href = "https://hoteladmin.auth.us-east-1.amazoncognito.com/login?client_id=49k21o4f3nk7ls8g5n4nv6uc1b&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://admin.ezeehotel.com"
  };