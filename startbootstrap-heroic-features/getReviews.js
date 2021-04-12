document.addEventListener("DOMContentLoaded", function(event) { 
   
   let url = 'https://mfwy4hr35f.execute-api.us-east-1.amazonaws.com/prod/retrievereviewratings';
    axios.get(url)
      .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        res = response.data;

        let lastGroup = '';
        for (let i = 0; i < response.data.length; i++) {
        var hotelName = response.data[i][2];

        if (lastGroup !== hotelName) {
        lastGroup = hotelName;
        $("#dvParent").append("<h3>" + hotelName + "</h3>");
        }
        $("#dvParent").append("<h5 style='font-style: italic;'>"+ response.data[i][0] + "</h5>");
        //Ratings
        rating = response.data[i][1];
        //end Ratings
        for (let j=0; j<rating; j++){
            var img = document.createElement('img');
            img.height=20;
            img.src = "http://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/512/star-full-icon.png";
            $("#dvParent").append(img);
        }
        $("#dvParent").append("<br>");
        $("#dvParent").append("<br>");
        }        

      })
      .catch(function (error) {
    });

});