const saveReservation = () => {
  let cname =document.getElementById('fname').value
  let email = document.getElementById('email').value
  let street = document.getElementById('street').value
  let contact_number = document.getElementById('contactnumber').value

  console.log('cust_name' + cname)
  
  event.preventDefault();
  console.log(window.location.href)
 location.href = "reserve.html"
 let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/customer?customerID=aa02c6ae-8615-11eb-8dcd-0242ac1300567&&customerName=jyo&&email=abc@gmail.com&&address=Granada+ave+Santa+clara&&contactNum=6'
};

 
