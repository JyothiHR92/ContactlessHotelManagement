function newRoom() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const roomTypeID = urlParams.get('roomtypeID');
	console.log(roomTypeID);
	window.location.href= "newRoom.html?roomTypeID="+roomTypeID;
}
function getRooms(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const roomtypeID = urlParams.get('roomtypeID')
	
	
	axios.get("https://cnevzzpdnl.execute-api.us-east-1.amazonaws.com/dev/room/id?id='"+roomtypeID+"'"
				)
				.then((response) => {
					var  rooms =[] ;
					rooms= JSON.stringify(response.data.data);
					console.log(JSON.stringify(response.data.data).length);
					
					var json_data = response.data.data;
					var result = [];
					console.log(json_data);
					for(var i in json_data)
						result.push([i, json_data [i]]);
					console.log(result.length);
					if(result.length > 0 ){
					document.getElementById("heading").innerHTML += "Select a Room to Update";
						ul = document.getElementById("list");
						var i;
						for(i=0;i<result.length;i++ ){
							let li = document.createElement('li');
							li.classList.add("list-group-item");
						li.style.cursor="pointer";
						var roomID = JSON.stringify(result[i][1].roomID);
						console.log(roomtypeID);	
						li.onclick=function() { 
						window.location.href="updateRoom.html?roomID="+event.target.name+"&roomTypeID="+roomtypeID;
							
							};
						ul.appendChild(li);
						var roomNum = JSON.stringify(result[i][1].roomNum).replaceAll('"','');
						
						li.innerHTML += roomNum;
						li.name=roomID;
						
						}
						}
						else {
							document.getElementById("heading").innerHTML += "No Rooms!";
						}
					
					

				}, (error) => {
					console.log(error);
				});

}