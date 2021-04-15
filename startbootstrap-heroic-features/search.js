function search() {

    var hotelName = document.getElementById('getHotelName');
    var roomType = document.getElementById('getRoomType');
    var carddisplay = document.getElementById('carddisplay');
    
    //hotelName.innerHTML = '';
    //roomType.innerHTML = '';
    //carddisplay.innerHTML = '';

    checkout = document.getElementById('datepickerto').value;
    checkin = document.getElementById('datepickerfrom').value;
    var e = document.getElementById("guests");
    var out = e.value;
    var l = document.getElementById('location');
    var loc = l.value;
    //calling search api
    console.log(checkin + checkout + out);
    let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/searchHotel?checkin='+checkin+'&&checkout='+checkout+'&&guests='+out +'&&location='+loc;
    axios.get(url)
      .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        console.log(response)
        res = response.data
        console.log(res.data[0].hotelId)
        console.log(response.data.data.length)
         /*for(var i = 0; i < response.data.data.length; i ++){
           carddisplay.innerHTML = generateSearchOutput(response)
         }*/
          generateSearchOutput(response)
      })
      .catch(function (error) {
        //resultElement.innerHTML = generateErrorHTMLOutput(error);
    });

    function generateSearchOutput(response){
      console.log('here')
      console.log('carddisplay = ' + JSON.stringify(document.querySelector('carddisplay')))
      cardtext = "";
      for (var i = 0; i < response.data.data.length; i++)
      {
        checkout = document.getElementById('datepickerto').value;
        checkin = document.getElementById('datepickerfrom').value;
        console.log(checkin)
        address = response.data.data[i].address
        console.log(address)
        address = address.split(" ")
        address = address.join("+")
        console.log(address)
        cardtext += `<div class="col-lg-3 col-md-3 mb-4">
        <div class="card h-70 shadow p-3 mb-5 bg-white rounded">
        <div class="card-body">
        <h4 class="card-title" id = "cardtitle" >${response.data.data[i].hotelName} </h4>
        <p class="card-text" id = "cardtext" > ${response.data.data[i].roomTypeName}</p>
        <p class="card-text" > Checkin: ${checkin}</p>
        <p class="Card-text" > Checkout: ${checkout}</p>
        <p class="card-text" > Price:${response.data.data[i].roomRate}</p>
        <p class="card-text" > Hotel Address:${response.data.data[i].address}</p>
        </div>
        <div class="card-footer">
        <form action = "./selectRoom.html">
        <input type="hidden" id="hotelName" name="HotelName" value = ${response.data.data[i].hotelName}>
        <input type="hidden" id="roomTypeName" name="roomType" value= ${response.data.data[i].roomTypeName}>
        <input type = "hidden" id = "roomId" name = "roomId" value = ${response.data.data[i].roomID}>
        <input type = "hidden" id = "cin" name = "cin" value = ${checkin}>
        <input type = "hidden" id = "cout" name = "cout" value = ${checkout}>
        <input type = "hidden" id = "hid" name = "hid" value = ${response.data.data[i].hotelId}>
        <input type = "hidden" id = "rtid" name = "rtid" value = ${response.data.data[i].roomTypeID}>
        <input type = "hidden" id = "rate" name="rate" value = ${response.data.data[i].roomRate}>
        <input type = "hidden" id = "addr" name="addr" value = ${address}>
        <button class="btn btn-primary" type = "submit" value = "submit"> Select </button>
        </form>
        </div>
        </div>
        </div>`;
      }
      return document.getElementById('carddisplay')
      .innerHTML = cardtext;

      //  return document.getElementById('carddisplay')
      //   .innerHTML = response.data.data.reduce((a, res) => a + 
      //   `<div class="col-lg-3 col-md-3 mb-4">
      //   <div class="card h-70">
      //   <div class="card-body">
      //   <h4 class="card-title" id = "cardtitle" >${res.hotelName} </h4>
      //   <p class="card-text" id = "cardtext" > ${res.roomTypeName }</p>
      //   </div>
      //   <div class="card-footer">
      //   <a href = "selectRoom.html" class="btn btn-primary" id = "select" onclick = "clickSelect()">Select</a>
      //   </div>
      //   </div>
      //   </div>`,''
      // );
      /*cardttitle = document.getElementById('cardtitle').value
      cardtext = document.getElementById('cardtext').value
      console.log(cardtitle + cardtext)*/
      //document.getElementById('select').onclick = clickSelect()
    }
}





