var hotelID =null;
function getHotelID(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	hotelID = urlParams.get('hotelID');
}
function createService(){
console.log(hotelID);
var serviceType = document.getElementById('serviceType').value;
axios.post("https://21s0obs4se.execute-api.us-east-1.amazonaws.com/dev/services", { 'hotelID' : hotelID, 'serviceType' :serviceType })
.then((response) => {
  document.getElementById("myModal").style.display = "block";
	document.getElementById("demo").innerHTML = "Successfully Created!";
}, (error) => {
  console.log(error);
});
}

function closemodal(){
	document.getElementById("myModal").style.display = "none";
	location.href = "services.html?hotelID="+hotelID;
}