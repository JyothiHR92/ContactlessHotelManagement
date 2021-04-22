var serviceID =null;
var hotelID = null;
function getService(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	serviceID = urlParams.get('serviceID')
	hotelID = urlParams.get('hotelID');
	
	axios.get("https://21s0obs4se.execute-api.us-east-1.amazonaws.com/dev/service/id?id="+serviceID
				)
				.then((response) => {
					console.log(response);
					var  roomType =[] ;
					roomType= JSON.stringify(response.data.data);
					console.log(roomType);
					var json_data = response.data.data;
					var result = [];
					document.getElementById('serviceType').value = json_data.serviceType;
					

				}, (error) => {
					console.log(error);
				});
}

function updateService(){
var serviceType = document.getElementById('serviceType').value;
axios.put("https://21s0obs4se.execute-api.us-east-1.amazonaws.com/dev/services", {'id':serviceID, 'serviceType': serviceType})
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
	location.href = "services.html?hotelID="+hotelID;
}