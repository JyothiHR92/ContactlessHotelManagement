    
document.addEventListener("DOMContentLoaded", function(event) { 

 //var customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493"; 
 var customerID = sessionStorage.getItem('sub');
 let url = 'https://s56kalfn3f.execute-api.us-east-1.amazonaws.com/prod/gethotelname?customerID='+customerID;
 axios.get(url)
 .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        var hoteName = response.data[0][0];

        document.getElementById('hName').textContent = hoteName.toUpperCase();    

      })
 .catch(function (error) {
 });

});

function submitRoomService()
{
  if(document.getElementById('qtyApp1').value == 0 &&  document.getElementById('qtyEnt1').value == 0 && document.getElementById('qtyDes1').value == 0 && document.getElementById('qtyApp2').value == 0 && 
    document.getElementById('qtyEnt2').value == 0 && document.getElementById('qtyDes2').value == 0 && document.getElementById('qtyApp3').value == 0 && document.getElementById('qtyEnt3').value == 0 &&
    document.getElementById('qtyApp4').value == 0 && document.getElementById('qtyEnt4').value == 0 && document.getElementById('qtyApp5').value == 0)
  {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please add the food items for the room service.');
      $('#myModal').modal('show');
  }
  else
  {
      window.location = "roomServiceConf.html";
  }
}

function addApp1()
{
   var quantityApp1 = document.getElementById('qtyApp1').value;
   var lblApp1 = document.getElementById('lblApp1').textContent;
   var lblAppPr1 = document.getElementById('lblAppPr1').textContent;
   lblAppPr1 =  lblAppPr1.replace('$', '');
   if(quantityApp1 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Appetizer.');
      $('#myModal').modal('show');
   }
   else
   {
      var totApp1 = parseInt(lblAppPr1) * quantityApp1;
      totApp1 = totApp1 + " " +parseInt(quantityApp1);
      localStorage.setItem(lblApp1, totApp1);
   }
}

function addEnt1()
{
   var quantityEnt1 = document.getElementById('qtyEnt1').value;
   var lblEnt1 = document.getElementById('lblEnt1').textContent;
   var lblEntPr1 = document.getElementById('lblEntPr1').textContent;
   lblEntPr1 =  lblEntPr1.replace('$', '');
   if(quantityEnt1 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Entree.');
      $('#myModal').modal('show');
   }
   else
   {
      var totEnt1 = parseInt(lblEntPr1) * quantityEnt1;
      totEnt1 = totEnt1 + " " +parseInt(quantityEnt1);
      localStorage.setItem(lblEnt1, totEnt1);
   }
}

function addDes1()
{
   var quantityDes1 = document.getElementById('qtyDes1').value;
   var lblDes1 = document.getElementById('lblDes1').textContent;
   var lblDesPr1 = document.getElementById('lblDesPr1').textContent;
   lblDesPr1 =  lblDesPr1.replace('$', '');
   if(quantityDes1 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Dessert.');
      $('#myModal').modal('show');
   }
   else
   {
      var totDes1 = parseInt(lblDesPr1) * quantityDes1;
      totDes1 = totDes1 + " " +parseInt(quantityDes1);
      localStorage.setItem(lblDes1, totDes1);
   }
}


function addApp2()
{
   var quantityApp2 = document.getElementById('qtyApp2').value;
   var lblApp2 = document.getElementById('lblApp2').textContent;
   var lblAppPr2 = document.getElementById('lblAppPr2').textContent;
   lblAppPr2 =  lblAppPr2.replace('$', '');
   if(quantityApp2 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Appetizer.');
      $('#myModal').modal('show');
      
   }
   else
   {
      var totApp2 = parseInt(lblAppPr2) * quantityApp2;
      totApp2 = totApp2 + " " +parseInt(quantityApp2);
      localStorage.setItem(lblApp2, totApp2);
   }
}

function addEnt2()
{
   var quantityEnt2 = document.getElementById('qtyEnt2').value;
   var lblEnt2 = document.getElementById('lblEnt2').textContent;
   var lblEntPr2 = document.getElementById('lblEntPr2').textContent;
   lblEntPr2 =  lblEntPr2.replace('$', '');
   if(quantityEnt2 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Entree.');
      $('#myModal').modal('show');
   }
   else
   {
      var totEnt2 = parseInt(lblEntPr2) * quantityEnt2;
      totEnt2 = totEnt2 + " " +parseInt(quantityEnt2);
      localStorage.setItem(lblEnt2, totEnt2);
   }
}

function addDes2()
{
   var quantityDes2 = document.getElementById('qtyDes2').value;
   var lblDes2 = document.getElementById('lblDes2').textContent;
   var lblDesPr2 = document.getElementById('lblDesPr2').textContent;
   lblDesPr2 =  lblDesPr2.replace('$', '');
   if(quantityDes2 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Dessert.');
      $('#myModal').modal('show');
   }
   else
   {
      var totDes2 = parseInt(lblDesPr2) * quantityDes2;
      totDes2 = totDes2 + " " +parseInt(quantityDes2);
      localStorage.setItem(lblDes2, totDes2);
   }
}

function addApp3()
{
   var quantityApp3 = document.getElementById('qtyApp3').value;
   var lblApp3 = document.getElementById('lblApp3').textContent;
   var lblAppPr3 = document.getElementById('lblAppPr3').textContent;
   lblAppPr3 =  lblAppPr3.replace('$', '');
   if(quantityApp3 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Appetizer.');
      $('#myModal').modal('show');
   }
   else
   {
      var totApp3 = parseInt(lblAppPr3) * quantityApp3;
      totApp3 = totApp3 + " " +parseInt(quantityApp3);
      localStorage.setItem(lblApp3, totApp3);
   }
}

function addEnt3()
{
   var quantityEnt3 = document.getElementById('qtyEnt3').value;
   var lblEnt3 = document.getElementById('lblEnt3').textContent;
   var lblEntPr3 = document.getElementById('lblEntPr3').textContent;
   lblEntPr3 =  lblEntPr3.replace('$', '');
   if(quantityEnt3 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Entree.');
      $('#myModal').modal('show');
   }
   else
   {
      var totEnt3 = parseInt(lblEntPr3) * quantityEnt3;
      totEnt3 = totEnt3 + " " +parseInt(quantityEnt3);
      localStorage.setItem(lblEnt3, totEnt3);
   }
}

function addApp4()
{
   var quantityApp4 = document.getElementById('qtyApp4').value;
   var lblApp4 = document.getElementById('lblApp4').textContent;
   var lblAppPr4 = document.getElementById('lblAppPr4').textContent;
   lblAppPr4 =  lblAppPr4.replace('$', '');
   if(quantityApp4 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Appetizer.');
      $('#myModal').modal('show');
   }
   else
   {
      var totApp4 = parseInt(lblAppPr4) * quantityApp4;
      totApp4 = totApp4 + " " +parseInt(quantityApp4);
      localStorage.setItem(lblApp4, totApp4);
   }
}

function addEnt4()
{
   var quantityEnt4 = document.getElementById('qtyEnt4').value;
   var lblEnt4 = document.getElementById('lblEnt4').textContent;
   var lblEntPr4 = document.getElementById('lblEntPr4').textContent;
   lblEntPr4 =  lblEntPr4.replace('$', '');
   if(quantityEnt4 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Entree.');
      $('#myModal').modal('show');
   }
   else
   {
      var totEnt4 = parseInt(lblEntPr4) * quantityEnt4;
      totEnt4 = totEnt4 + " " +parseInt(quantityEnt4);
      localStorage.setItem(lblEnt4, totEnt4);
   }
}

function addApp5()
{
   var quantityApp5 = document.getElementById('qtyApp5').value;
   var lblApp5 = document.getElementById('lblApp5').textContent;
   var lblAppPr5 = document.getElementById('lblAppPr5').textContent;
   lblAppPr5 =  lblAppPr5.replace('$', '');
   if(quantityApp5 == 0)
   {
      $('#myModalTitle').html('Room Service Request');
      $('#myModalBody').html('Please Enter the quantity for the Appetizer.');
      $('#myModal').modal('show');
   }
   else
   {
      var totApp5 = parseInt(lblAppPr5) * quantityApp5;
      totApp5 = totApp5 + " " +parseInt(quantityApp5);
      localStorage.setItem(lblApp5, totApp5);
   }
}

function insertRoomService()
{
  var strMsg = "";
  var lblItems = document.querySelectorAll('label[class="col-sm-4 col-form-label"]');
  //var customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493";
  var customerID = sessionStorage.getItem('sub');
  var serviceType = document.getElementById('serviceType').value
  var lblTotalBill = document.getElementById('lblTotalBill').textContent;
  lblTotalBill = parseInt(lblTotalBill.replace('$', ''));

  for (i=0;i<lblItems.length;i++)
  {
   strMsg = strMsg + document.getElementById('lbl'+i).textContent + " quantity " + document.getElementById('lblQt'+i).value +"\n";
 }

 strMsg = "Order Placed for \n" + strMsg;

 axios.post('https://pohsxfh3h3.execute-api.us-east-1.amazonaws.com/prod/sendemailconcierge', {strMsg: strMsg, customerID: customerID})        
 .then(function (response) {
 })
 .catch(function (error) {
  $('#myModalTitle').html('Room Service Confirmation');
  $('#myModalBody').html('Sorry there is some error. Try again.');
  $('#myModal').modal('show');
  console.log(error);
});



 axios.post('https://gdbpv15760.execute-api.us-east-1.amazonaws.com/prod/insertconciergebooking', {serviceType: serviceType, customerID: customerID, totalAmt: lblTotalBill})        
 .then(function (response) {
  $('#myModalTitle').html('Room Service Confirmation');
  $('#myModalBody').html('Thank You! Your order has been placed.');
  $('#myModal').modal('show');
  $('#myModal').on('hidden.bs.modal', function (e) {
      window.location.href = "myOngoingTrip.html";
  })
})
 .catch(function (error) {
  $('#myModalTitle').html('Room Service Confirmation');
  $('#myModalBody').html('Sorry there is some error. Try again.');
  $('#myModal').modal('show');
  console.log(error);
});
}

//redirect to dashboard page
const getDashboard = () =>{
   event.preventDefault();
   location.href = "dashboard.html"
};