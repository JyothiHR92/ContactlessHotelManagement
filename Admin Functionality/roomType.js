function newRoomType() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const hotelID = urlParams.get('hotelID');
	window.location.href= "newRoomType.html?hotelID="+hotelID;
}
function getRoomTypes(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const hotelID = urlParams.get('hotelID')
	const action = urlParams.get('action')
	console.log(action);
	console.log(hotelID);
	if(action == 'roomtype'){
		document.getElementById('newBtn').style.display = "block";
	}
	axios.get("https://8m9iw3ecy8.execute-api.us-east-1.amazonaws.com/dev/roomtype/id?id='"+hotelID+"'"
				)
				.then((response) => {
					var  hotels =[] ;
					hotels= JSON.stringify(response.data.data);
					console.log(JSON.stringify(response.data.data).length);
					
					var json_data = response.data.data;
					var result = [];
					console.log(json_data);
					for(var i in json_data)
						result.push([i, json_data [i]]);
					console.log(result.length);
					if(result.length > 0 ){
					if(action == 'roomtype'){
					document.getElementById("heading").innerHTML += "Select a Room Type to Update";
					}
					else if(action == 'room'){
						document.getElementById("heading").innerHTML += "Select the Room Type";
					}
						ul = document.getElementById("list");
						var i;
						for(i=0;i<result.length;i++ ){
							let li = document.createElement('li');
							li.classList.add("list-group-item");
						li.style.cursor="pointer";
						var roomtypeID = JSON.stringify(result[i][1].roomTypeID);
						console.log(roomtypeID);	
						li.onclick=function() { 
							if(action == 'roomtype'){
								window.location.href="updateRoomType.html?roomTypeID="+event.target.name+"&hotelID="+hotelID;
							}
							else if(action == 'room'){
								window.location.href = "rooms.html?roomtypeID="+event.target.name;
							}
							};
						ul.appendChild(li);
						var roomTypeName = JSON.stringify(result[i][1].roomTypeName).replaceAll('"','');
						
						li.innerHTML += roomTypeName;
						li.name=roomtypeID;
						
						}
						}
						else {
							document.getElementById("heading").innerHTML += "No Room Types!";
						}
					
					

				}, (error) => {
					console.log(error);
				});

}