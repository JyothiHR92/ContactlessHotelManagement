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
          alert(err);
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
        alert(err);
      } else {
        console.log("confirmed");
        document.getElementById("register").style = "display:none";
        document.getElementById("signupconfirm").style = "display:none";
        document.getElementById("login").style = "display:block";
      }
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

  