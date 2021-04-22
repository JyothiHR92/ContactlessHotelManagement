function newRoom() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const hotelID = urlParams.get('hotelID');
	window.location.href= "newAmenity.html?hotelID="+hotelID;
}
function getAmenities(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const hotelID = urlParams.get('hotelID')
	
	
	axios.get("https://0wk8kle51c.execute-api.us-east-1.amazonaws.com/dev/amenities/id?id='"+hotelID+"'"
				)
				.then((response) => {
					var  amenities =[] ;
					amenities= JSON.stringify(response.data.data);
					console.log(JSON.stringify(response.data.data).length);
					
					var json_data = response.data.data;
					var result = [];
					console.log(json_data);
					for(var i in json_data)
						result.push([i, json_data [i]]);
					console.log(result.length);
					if(result.length > 0 ){
					document.getElementById("heading").innerHTML += "Select an Amenity to Update";
						ul = document.getElementById("list");
						var i;
						for(i=0;i<result.length;i++ ){
							let li = document.createElement('li');
							li.classList.add("list-group-item");
						li.style.cursor="pointer";
						var amenitiesID = JSON.stringify(result[i][1].amenitiesID);
							
						li.onclick=function() { 
						window.location.href="updateAmenity.html?amenitiesID="+event.target.name+"&hotelID="+hotelID;
							
							};
						ul.appendChild(li);
						var amenitiesName = JSON.stringify(result[i][1].amenitiesName).replaceAll('"','');
						
						li.innerHTML += amenitiesName;
						li.name=amenitiesID;
						
						}
						}
						else {
							document.getElementById("heading").innerHTML += "No Amenities!";
						}
					
					

				}, (error) => {
					console.log(error);
				});

}