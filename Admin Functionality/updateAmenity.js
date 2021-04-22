var amenitiesID =null;
var hotelID = null;
function getAmenity(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	amenitiesID = urlParams.get('amenitiesID')
	hotelID = urlParams.get('hotelID');
	
	axios.get("https://0wk8kle51c.execute-api.us-east-1.amazonaws.com/dev/amenity/id?id="+amenitiesID
				)
				.then((response) => {
					console.log(response);
					var  roomType =[] ;
					roomType= JSON.stringify(response.data.data);
					console.log(roomType);
					var json_data = response.data.data;
					var result = [];
					document.getElementById('amenitiesName').value = json_data.amenitiesName;
					document.getElementById('amenitiesDes').value = json_data.amenitiesDes;
					document.getElementById('maxOccupancy').value = json_data.maxOccupancy;
					

				}, (error) => {
					console.log(error);
				});
}

function updateAmenity(){
var amenitiesName = document.getElementById('amenitiesName').value;
var amenitiesDes = document.getElementById('amenitiesDes').value;
var maxOccupancy = document.getElementById('maxOccupancy').value;
axios.put("https://0wk8kle51c.execute-api.us-east-1.amazonaws.com/dev/amenities", {'id':amenitiesID, 'amenitiesName': amenitiesName, 'amenitiesDes' : amenitiesDes, 'maxOccupancy' :maxOccupancy})
.then((response) => {
  document.getElementById("myModal").style.display = "block";
	document.getElementById("demo").innerHTML = "Successfully Updated!";
}, (error) => {
  console.log(error);
});
}

function closemodal(){
console.log('hi');
	document.getElementById("myModal").style.display = "none";
	location.href = "amenities.html?hotelID="+hotelID;
}