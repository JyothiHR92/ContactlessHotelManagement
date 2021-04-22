var roomTypeID =null;
var roomID = null;
function getRoom(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	roomTypeID = urlParams.get('roomTypeID')
	roomID = urlParams.get('roomID');
	
	axios.get("https://cnevzzpdnl.execute-api.us-east-1.amazonaws.com/dev/rooms/id?id="+roomID
				)
				.then((response) => {
					console.log(response);
					var  roomType =[] ;
					roomType= JSON.stringify(response.data.data);
					console.log(roomType);
					var json_data = response.data.data;
					var result = [];
					document.getElementById('roomNumber').value = json_data.roomNum;
					
					

				}, (error) => {
					console.log(error);
				});
}

function updateRoom(){
var roomNumber = document.getElementById('roomNumber').value;
axios.put("https://cnevzzpdnl.execute-api.us-east-1.amazonaws.com/dev/room", {'roomID': roomID, 'roomTypeID' : roomTypeID, 'roomNum' :roomNumber })
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
	location.href = "rooms.html?roomtypeID="+roomTypeID;
}
