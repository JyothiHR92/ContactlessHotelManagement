const signUp = () => {
    event.preventDefault();
    console.log("signup");
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const username = document.getElementById("UserName").value;
    const emailadd = document.getElementById("exampleInputEmail1").value;
    const password = document.getElementById("exampleInputPassword1").value;

    var email = new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: emailadd,
    });

    userPool.signUp(username, password, [email], null, function (err, result) {
        if (err) {
          alert(JSON.stringify(err));
        } else {
           document.getElementById("register").style = "display:none";
          document.getElementById("signupconfirm").style = "display:block";
        }
    });
  
};
//Confirmation code from cognito
const confirmCode = () => {
    event.preventDefault();
    
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const username = document.getElementById('UserName').value;
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool,
    });
    const code = document.querySelector("#confirm").value;
    console.log("code =" + code);
    cognitoUser.confirmRegistration(code, true, function (err, results) {
      if (err) {
        alert(JSON.stringify(err));
      } else {
        console.log("confirmed");
        document.getElementById("register").style = "display:none";
        document.getElementById("signupconfirm").style = "display:none";
        document.getElementById("login").style = "display:block";
      }
    });
};

//resend code
const resendCode = () => {
  event.preventDefault();
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const username = document.getElementById('UserName').value;
  console.log(username)
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: username,
    Pool: userPool,
  });
  
  cognitoUser.resendConfirmationCode(function (err){
    if (err) {
      alert(err);
    }
    
    console.log("resent code")
  });
};
//cognito Login
const signIn = () => {
  event.preventDefault();
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
  const username = document.getElementById("uname").value;
  const password = document.getElementById("pswd1").value;

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
      document.getElementById("register").style = "display:none";
      document.getElementById("signupconfirm").style = "display:none";
      document.getElementById('login').style = "display:none";
      document.getElementById('customerdetails').style = "display:block";
    },
    onFailure: function (err) {
      alert(JSON.stringify(err));
    },
  });
};

const checkLogin = () => {
  console.log("checking login..");
  const login = false;
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  //const userBtn = document.querySelector(".user");
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
      
      //userBtn.innerHTML += cognitoUser.username;
      getUserAttributes();
  } 
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
          });

      });
  }
  
}

//cognito login for registered user
const loginopt = () => {
  event.preventDefault();
  document.getElementById("register").style = "display:none";
  document.getElementById("signupconfirm").style = "display:none";
  document.getElementById("login").style = "display:none";
  document.getElementById("gen_login").style = "display:block";
};

 
