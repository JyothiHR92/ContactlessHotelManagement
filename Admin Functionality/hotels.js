function getHotels(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const action = urlParams.get('action')
	console.log(action);
	var baseURL = '';
	if(action == 'roomtype'){
		baseURL = 'roomType.html?action=roomtype&hotelID=';
	}
	else if (action =='room'){
		baseURL = 'roomType.html?action=room&hotelID=';
	}
	else if(action == 'amenities'){
		baseURL = 'amenities.html?hotelID=';
	}
	else if( action == 'services'){
		baseURL = 'services.html?hotelID=';
	}
	else if(action == 'reservations'){
		baseURL = 'reservations.html?hotelID='
	}
	axios.get("https://dbq6me3c75.execute-api.us-east-1.amazonaws.com/dev/hotel"
				)
				.then((response) => {
					var  hotels =[] ;
					hotels= JSON.stringify(response.data.data);
					console.log(JSON.stringify(response.data.data).length);
					
					var json_data = response.data.data;
					var result = [];
					
					for(var i in json_data)
						result.push([i, json_data [i]]);
					console.log(result.length);
					
						ul = document.getElementById("list");
						var i;
						for(i=0;i<result.length;i++ ){
							let li = document.createElement('li');
							li.classList.add("list-group-item");
						li.style.cursor="pointer";
						var hotelID = JSON.stringify(result[i][1].hotelID);
						console.log(hotelID);
						var hotelName = JSON.stringify(result[i][1].hotelName).replaceAll('"','');
						var hotelID = JSON.stringify(result[i][1].hotelID).replaceAll('"','');
						li.onclick=function() {if(action == 'reservations') {
							window.location.href=baseURL+event.target.name+'&hotelName='+hotelName;
						}
						else{window.location.href=baseURL+event.target.name}};
						ul.appendChild(li);
						
						li.innerHTML += hotelName;
						li.name=hotelID;
						
						}
					
					

				}, (error) => {
					console.log(error);
				});

}