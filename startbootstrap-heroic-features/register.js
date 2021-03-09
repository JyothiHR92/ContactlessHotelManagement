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
          document.getElementById("confirm").style = "display:block";
        }
    });
  
};