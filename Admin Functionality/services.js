function newRoom() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const hotelID = urlParams.get('hotelID');
	window.location.href= "newService.html?hotelID="+hotelID;
}
function getServices(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const hotelID = urlParams.get('hotelID')
	
	
	axios.get("https://21s0obs4se.execute-api.us-east-1.amazonaws.com/dev/services/id?id='"+hotelID+"'"
				)
				.then((response) => {
					var  services =[] ;
					services= JSON.stringify(response.data.data);
					console.log(JSON.stringify(response.data.data).length);
					
					var json_data = response.data.data;
					var result = [];
					console.log(json_data);
					for(var i in json_data)
						result.push([i, json_data [i]]);
					console.log(result.length);
					if(result.length > 0 ){
					document.getElementById("heading").innerHTML += "Select a Service to Update";
						ul = document.getElementById("list");
						var i;
						for(i=0;i<result.length;i++ ){
							let li = document.createElement('li');
							li.classList.add("list-group-item");
						li.style.cursor="pointer";
						var serviceID  = JSON.stringify(result[i][1].serviceID );
							
						li.onclick=function() { 
						window.location.href="updateService.html?serviceID="+event.target.name+"&hotelID="+hotelID;
							
							};
						ul.appendChild(li);
						var serviceType  = JSON.stringify(result[i][1].serviceType).replaceAll('"','');
						
						li.innerHTML += serviceType;
						li.name=serviceID;
						
						}
						}
						else {
							document.getElementById("heading").innerHTML += "No Services!";
						}
					
					

				}, (error) => {
					console.log(error);
				});

}