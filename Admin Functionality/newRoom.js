var roomTypeID =null;
function getRoomTypeID(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	roomTypeID = urlParams.get('roomTypeID');
}
function createRoom(){

var roomNumber = document.getElementById('roomNumber').value;
axios.post("https://cnevzzpdnl.execute-api.us-east-1.amazonaws.com/dev/room", { 'roomTypeID' : roomTypeID, 'roomNum' :roomNumber })
.then((response) => {
  document.getElementById("myModal").style.display = "block";
	document.getElementById("demo").innerHTML = "Successfully Created!";
}, (error) => {
  console.log(error);
});
}

function closemodal(){
	document.getElementById("myModal").style.display = "none";
	location.href = "rooms.html?roomtypeID="+roomTypeID;
}