var hotelID =null;
function getHotelID(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	hotelID = urlParams.get('hotelID');
}
function createAmenity(){
console.log(hotelID);
var amenitiesName = document.getElementById('amenitiesName').value;
var amenitiesDes = document.getElementById('amenitiesDes').value;
var maxOccupancy = document.getElementById('maxOccupancy').value;
axios.post("https://0wk8kle51c.execute-api.us-east-1.amazonaws.com/dev/amenities", { 'amenitiesName' : amenitiesName, 'amenitiesDes' :amenitiesDes, 'hotelID':hotelID, 'maxOccupancy': maxOccupancy })
.then((response) => {
  document.getElementById("myModal").style.display = "block";
	document.getElementById("demo").innerHTML = "Successfully Created!";
}, (error) => {
  console.log(error);
});
}

function closemodal(){
	document.getElementById("myModal").style.display = "none";
	location.href = "amenities.html?hotelID="+hotelID;
}