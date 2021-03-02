function search() {

    var hotelName = document.getElementById('getHotelName');
    var roomType = document.getElementById('getRoomType');
    
    hotelName.innerHTML = '';
    roomType.innerHTML = '';

    checkout = document.getElementById('datepickerto').value;
    checkin = document.getElementById('datepickerfrom').value;
    var e = document.getElementById("guests");
    var out = e.value;
    

    console.log(checkin + checkout + out);
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/searchHotel?checkin='+checkin+'&&checkout='+checkout+'&&guests='+out;
    axios.get(url)
      .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
      })
      .catch(function (error) {
        //resultElement.innerHTML = generateErrorHTMLOutput(error);
    });   
}