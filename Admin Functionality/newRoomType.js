var hotelID =null;
function getHotelID(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	hotelID = urlParams.get('hotelID');
}
function createRoomType(){
console.log(hotelID);
var name = document.getElementById('roomTypeName').value;
var totalRooms = document.getElementById('totNumRooms').value;
var occupancy = document.getElementById('maxOccupancy').value ;
var rate = document.getElementById('rate').value;
axios.post("https://8m9iw3ecy8.execute-api.us-east-1.amazonaws.com/dev/roomtype", { 'hotelID' : hotelID, 'roomTypeName' :name, 'totalNumRooms':totalRooms, 'maxOccupancy' : occupancy, 'roomRate' : rate })
.then((response) => {
  document.getElementById("myModal").style.display = "block";
	document.getElementById("demo").innerHTML = "Successfully Created!";
}, (error) => {
  console.log(error);
});
}

function closemodal(){
	document.getElementById("myModal").style.display = "none";
	location.href = "hotels.html?action=roomtype";
}