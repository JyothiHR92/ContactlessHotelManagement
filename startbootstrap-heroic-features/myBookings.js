 document.addEventListener("DOMContentLoaded", function(event) { 

       //var customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493"; 
       var customerID = sessionStorage.getItem('sub');

       let url = 'https://s56kalfn3f.execute-api.us-east-1.amazonaws.com/prod/gethotelname?customerID='+customerID;
       axios.get(url)
       .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        var hoteName = response.data[0][0];

        document.getElementById('hName').textContent = hoteName.toUpperCase();    

       })
       .catch(function (error) {
       });

       var now = new Date();
       var day = ("0" + now.getDate()).slice(-2);
       var month = ("0" + (now.getMonth() + 1)).slice(-2);

       var today = now.getFullYear() + "-" + (month) + "-" + (day);
       var hour = new Date().getHours();  
       var currDateTime = today+' '+hour+':00:00';

       //currDateTime = '2021-03-24 07:00:00'; // remove this while deploying

       url = 'https://dt0qiuxp0h.execute-api.us-east-1.amazonaws.com/prod/retrieveamenitiesbooking?currDateTime='+currDateTime+'&customerID='+customerID;
        axios.get(url)
          .then(function (response) {
            if(response.data.length > 0)
            {
              localStorage.clear();
              var table = document.createElement('table');
              table.setAttribute('id','tblBookings');
              for (let i = 0; i < response.data.length; i++) {
                      tr = table.insertRow(-1);

                      var tabCell = tr.insertCell(-1);
                      tabCell.innerHTML = response.data[i][0];
                      tabCell.style.display = "none";

                      var tabCell = tr.insertCell(-1);    
                      tabCell.innerHTML = response.data[i][1].charAt(0).toUpperCase() + response.data[i][1].slice(1) + " Reservation";
                      tabCell.style.fontSize = "30px";
                      tabCell.style.fontWeight = "bold";

                      var tabCell = tr.insertCell(-1);
                      var startTime = Convert24to12(response.data[i][2].substr(11, 2));
                      var endTime = Convert24to12(response.data[i][3].substr(11, 2));
                      tabCell.innerHTML = "<span style='font-size:20px'>" + "<b>Date: </b>" + response.data[i][5] + "<br/>" + "<b>Time: </b>"+ startTime + "-" + endTime  + "<br/>" + "<b>No. of guests: </b>" + response.data[i][4] +  "</span>" +  "</br>";
                      
                      var tabCell = tr.insertCell(-1);
                      tabCell.innerHTML = response.data[i][5];
                      tabCell.style.display = "none";
                      
                      var tabCell = tr.insertCell(-1);
                      tabCell.innerHTML = response.data[i][2].substr(11, 5) + "-" + response.data[i][3].substr(11, 5);
                      tabCell.style.display = "none";
                      
                      var tabCell = tr.insertCell(-1);
                      tabCell.innerHTML = response.data[i][4];
                      tabCell.style.display = "none";

                      //Update
                      this.td = document.createElement('td');
                      tr.appendChild(this.td);
                      var btnUpdate = document.createElement('input');
                      btnUpdate.setAttribute('type', 'button');    // SET INPUT ATTRIBUTE.
                      btnUpdate.setAttribute('value', 'Update');
                      btnUpdate.setAttribute('class', 'btn btn-primary');
                      btnUpdate.setAttribute('onclick', 'Update(this)');   // ADD THE BUTTON's 'onclick' EVENT.
                      this.td.appendChild(btnUpdate);

                      // CANCEL
                      this.td = document.createElement('td');
                      tr.appendChild(this.td);
                      var btnCancel = document.createElement('input');
                      btnCancel.setAttribute('type', 'button');    // SET INPUT ATTRIBUTE.
                      btnCancel.setAttribute('value', 'Cancel');
                      btnCancel.setAttribute('class', 'btn btn-primary');
                      btnCancel.setAttribute('onclick', 'Delete(this)');   // ADD THE BUTTON's 'onclick' EVENT.
                      this.td.appendChild(btnCancel);

              }
              
                  

              var parentDiv = document.querySelector('#dvTable');
              parentDiv.appendChild(table);
            }
            else
            {
              var parentDiv = document.querySelector('#dvTable');
              parentDiv.remove();
              h5 = document.createElement("h5");
              h5.textContent = "The are currently no bookings to be displayed.";
              h5.style.textAlign = "center";
              var parentDiv = document.querySelector('#dvRecords');
              parentDiv.appendChild(h5);
            }
          })
          .catch(function (error) {
        });
        

        });


        this.Update = function (td) {
            selectedRow = td.parentElement.parentElement;
            var bookingID = selectedRow.cells[0].innerHTML;
            var serviceType = String(selectedRow.cells[1].innerHTML).toLowerCase().split(' ')[0];
            var bookingDate = selectedRow.cells[3].innerHTML;
            var dateArr = bookingDate.split("-");
            var date1= dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
            var timeSlotVal = String(selectedRow.cells[4].innerHTML).split('-')[1];
            var guests = selectedRow.cells[5].innerHTML;
            localStorage.setItem("value", "update");
            localStorage.setItem("bookingID", bookingID);
            localStorage.setItem("serviceType", serviceType);
            localStorage.setItem("bookingDate", date1);
            localStorage.setItem("timeSlotVal", timeSlotVal);
            localStorage.setItem("guests", guests);
            if(serviceType == "gym")
            {
              window.location.href = "gymBooking.html";
            }
            else if(serviceType == "pool")
            {
              window.location.href = "poolBooking.html";
            }
            else if(serviceType == "laundry")
            {
              window.location.href = "laundryBooking.html";
            }
            else if(serviceType == "spa")
            {
              window.location.href = "spaBooking.html";
            }
            else if(serviceType == "restaurant")
            {
              window.location.href = "restaurantBooking.html";
            }

        }


         this.Delete = function (td) {
            selectedRow = td.parentElement.parentElement;
            var bookingID = selectedRow.cells[0].innerHTML;
            axios.put('https://dq7ndt54o2.execute-api.us-east-1.amazonaws.com/prod/cancelamenitybooking', {bookingID: bookingID})        
                .then(function (response) {
                $('#myModalTitle').html('My Amenity Bookings');
                $('#myModalBody').html('The amenity booking has been cancelled.');
                $('#myModal').modal('show');
                $('#myModal').on('hidden.bs.modal', function (e) {
                  window.location.href = "myOngoingTrip.html";
                })
                
              })
              .catch(function (error) {
                $('#myModalTitle').html('My Amenity Bookings');
                $('#myModalBody').html('Sorry there is some error. Try again.');
                $('#myModal').modal('show');
                console.log(error);
              });
        }

        function Convert24to12(hours)
        {
          var AmOrPm = hours >= 12 ? 'PM' : 'AM';
          hours = (hours % 12) || 12;
          var finalTime = hours + ":00" + " " + AmOrPm; 
          return finalTime;
        }
//onclick of userDahboard page
const getDashboard = () =>
{
  event.preventDefault();
  location.href = "dashboard.html"
}