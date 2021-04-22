var hotelID =null;
var roomTypeID = null;
function getRoomTypes(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	hotelID = urlParams.get('hotelID')
	roomTypeID = urlParams.get('roomTypeID');
	console.log(hotelID);
	console.log(roomTypeID);
	
	axios.get("https://8m9iw3ecy8.execute-api.us-east-1.amazonaws.com/dev/roomtypes/id?id="+roomTypeID
				)
				.then((response) => {
					console.log(response);
					var  roomType =[] ;
					roomType= JSON.stringify(response.data.data);
					console.log(roomType);
					var json_data = response.data.data;
					var result = [];
					document.getElementById('roomTypeName').value = json_data.roomTypeName;
					document.getElementById('totNumRooms').value = json_data.totalNumRooms;
					document.getElementById('maxOccupancy').value = json_data.maxOccupancy;
					document.getElementById('rate').value = json_data.roomRate;
					
					

				}, (error) => {
					console.log(error);
				});
}
function updateRoomType(){
console.log(hotelID);
var name = document.getElementById('roomTypeName').value;
var totalRooms = document.getElementById('totNumRooms').value;
var occupancy = document.getElementById('maxOccupancy').value ;
var rate = document.getElementById('rate').value;
axios.put("https://8m9iw3ecy8.execute-api.us-east-1.amazonaws.com/dev/roomtype", {'id': roomTypeID, 'hotelID' : hotelID, 'roomTypeName' :name, 'totalNumRooms':totalRooms, 'maxOccupancy' : occupancy, 'roomRate' : rate })
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
	location.href = "hotels.html?action=roomtype";
}
