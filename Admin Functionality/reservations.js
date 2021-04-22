function getReservations(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const hotelID = urlParams.get('hotelID')
	const hotelName = urlParams.get('hotelName')
	
	axios.get("https://6vcqhzktf4.execute-api.us-east-1.amazonaws.com/dev/reservations/id?id='"+hotelID+"'"
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
					document.getElementById("heading").innerHTML += "Reservations for Hotel "+hotelName+" :";
						//ul = document.getElementById("list");
						table =  document.getElementById("table");
						var i;
						for(i=0;i<result.length;i++ ){
							var reservationID = JSON.stringify(result[i][1].reservationID).replaceAll('"','');
							var row = table.insertRow(i+1);
							 var cell1 = row.insertCell(0);
							var cell2 = row.insertCell(1);
							var cell3 = row.insertCell(2);
							var cell4 = row.insertCell(3);
							var cell5 = row.insertCell(4);
							var checkInDate = JSON.stringify(result[i][1].checkInDate).replaceAll('T00:00:00.000Z','');
							var checkOutDate = JSON.stringify(result[i][1].checkOutDate).replaceAll('T00:00:00.000Z','');
							cell1.innerHTML = reservationID;
							cell2.innerHTML = JSON.stringify(result[i][1].roomID).replaceAll('"','');
							cell3.innerHTML = JSON.stringify(result[i][1].customerID).replaceAll('"','');
							cell4.innerHTML = checkInDate.replaceAll('"','');
							cell5.innerHTML = checkOutDate.replaceAll('"','');
							cell1.style = 'border: 1px solid'
							cell2.style = 'border: 1px solid'
							cell3.style = 'border: 1px solid'
							cell4.style = 'border: 1px solid'
							cell5.style = 'border: 1px solid'
							
					
						
						}
						}
						else {
							document.getElementById("heading").innerHTML += "No Reservations!";
						}
					
					

				}, (error) => {
					console.log(error);
				});

}