
    document.addEventListener("DOMContentLoaded", function(event) { 

       //var customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493"; 
       var customerID = sessionStorage.getItem('sub');

       let url = 'https://s56kalfn3f.execute-api.us-east-1.amazonaws.com/prod/gethotelname?customerID='+customerID;
       axios.get(url)
       .then(function (response) {
        //resultElement.innerHTML = generateSuccessHTMLOutput(response);
        var hoteName = response.data[0][0].toUpperCase();

        document.getElementById('hName').textContent = hoteName;    

       })
       .catch(function (error) {
       });

       if(localStorage.getItem("value") == "update")
       {
            document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
            document.getElementById('inpGuests').value = localStorage.getItem("guests");
            timeVal = localStorage.getItem("timeSlotVal");
            var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
            document.getElementById('inpTime').value = inpTime;
       }
       else
       {
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

        var today = now.getFullYear() + "-" + (month) + "-" + (day);

        $('#inpDate').val(today);
        $('#inpDate').attr('min', today); 
       }

        });

        function submitHouseKeeping()
        {
          var strMessage = "";

            if (document.getElementById('chkTowels').checked == false && document.getElementById('chkToiletries').checked == false && document.getElementById('chkCleaning').checked == false && document.getElementById('txtOther').value == "")
            {
                $('#myModalTitle').html('HouseKeeping');
                $('#myModalBody').html('Please select any house keeping facility or enter any requests in others before submitting.');
                $('#myModal').modal('show');
            }
            else
            {
            if (document.getElementById('chkTowels').checked == true)
            {
                strMessage ="Extra towels needed";
            }
            if (document.getElementById('chkToiletries').checked == true)
            {
                strMessage ="Extra toiletries needed";
            }
            if (document.getElementById('chkCleaning').checked == true)
            {
                strMessage ="Room cleaning needed";
            }
            if (document.getElementById('chkTowels').checked == true && document.getElementById('chkToiletries').checked == true)
            {
                strMessage = "Extra towels and toiletries needed";
            }
            if (document.getElementById('chkTowels').checked == true && document.getElementById('chkCleaning').checked == true)
            {
                strMessage = "Extra towels and Room cleaning needed";
            }
            if (document.getElementById('chkToiletries').checked == true && document.getElementById('chkCleaning').checked == true)
            {
                strMessage = "Extra toiletries and Room cleaning needed";
            }
            if (document.getElementById('chkTowels').checked == true && document.getElementById('chkToiletries').checked == true && document.getElementById('chkCleaning').checked == true)
            {
                strMessage = "Extra towels, toiletries and Room cleaning needed";
            }
            if(document.getElementById('txtOther').value != "" && strMessage != "")
            {
                strMessage = strMessage + "\n" + "Other Requests: " + document.getElementById('txtOther').value;
            }
            else if(document.getElementById('txtOther').value != "" && strMessage == "")
            {
                strMessage = "Other Requests: " + document.getElementById('txtOther').value;
            }


            //customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493";
            var customerID = sessionStorage.getItem('sub');

            axios.post('https://sk1ryqstwb.execute-api.us-east-1.amazonaws.com/prod/sendemailhousekeeping', {strMsg: strMessage, customerID: customerID})        
                .then(function (response) {
                $('#myModalTitle').html('HouseKeeping');
                $('#myModalBody').html('Thank You! Your request has been sent to the front desk.');
                $('#myModal').modal('show');
                $('#myModal').on('hidden.bs.modal', function (e) {
                    window.location.href = "myOngoingTrip.html";
                })
              })
              .catch(function (error) {
                $('#myModalTitle').html('HouseKeeping');
                $('#myModalBody').html('Sorry there is some error. Try again.');
                $('#myModal').modal('show');
                console.log(error);
              });
          }
        }

        function onChangeSelect()
        {
            var now = new Date();
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);

            var today = now.getFullYear() + "-" + (month) + "-" + (day);

            if(document.getElementById('inpDate').value > today)
            {
            var length = document.getElementById('inpTime').options.length;

             for (let i = 0; i < length; ++i) {
                document.getElementById('inpTime').options[i].disabled = false;
             }
            }
            else if (document.getElementById('inpDate').value == today)
            {
                var hour = new Date().getHours();  

                $("#inpTime option").each(function() {
                if (hour + 1 >= $(this).val())
                 $(this).prop("disabled", true);
                });

            }
                 
        }

        function submitGymBooking()
        {
            var serviceType = 'gym';
            //customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493";
            var customerID = sessionStorage.getItem('sub');

            var dtStr =  document.getElementById('inpDate').value;

            var timeStr = document.getElementById('inpTime').options[document.getElementById('inpTime').selectedIndex].text;

            var timeVal1 = timeStr.split('-')[0];
            var timeVal2 = timeStr.split('-')[1];
            var startTime = convertTimeFrom12To24(timeVal1);
            var endTime = convertTimeFrom12To24(timeVal2);

            var guests = document.getElementById('inpGuests').value;
            startTime = dtStr+" "+startTime;
            endTime = dtStr+" "+endTime;

            if(localStorage.getItem("value") == "update")
            {
               bookingID = localStorage.getItem("bookingID"); 
               axios.put('https://aa430bqyd0.execute-api.us-east-1.amazonaws.com/prod/updateamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests, bookingID: bookingID})        
               .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Gym Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        localStorage.clear();
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })

                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Gym Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        
                    }
                    else
                    {
                        $('#myModalTitle').html('Gym Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                    }

                })
               .catch(function (error) {
                        $('#myModalTitle').html('Gym Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        console.log(error);
                });
            }
            else
            {
                axios.post('https://ikmq8orng7.execute-api.us-east-1.amazonaws.com/prod/insertamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests})        
                    .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Gym Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })
                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Gym Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show'); 
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                    else
                    {
                        $('#myModalTitle').html('Gym Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                  })
                  .catch(function (error) {
                        $('#myModalTitle').html('Gym Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                        console.log(error);
                  });
            }
            
        }

        function setToday()
        {
            var now = new Date();
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var today = now.getFullYear() + "-" + (month) + "-" + (day);
            $('#inpDate').val(today);
            $('#inpDate').attr('min', today);             
        }

        function submitPoolBooking()
        {
            var serviceType = 'pool';
            //customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493";
            var customerID = sessionStorage.getItem('sub');

            var dtStr =  document.getElementById('inpDate').value;

            var timeStr = document.getElementById('inpTime').options[document.getElementById('inpTime').selectedIndex].text;

            var timeVal1 = timeStr.split('-')[0];
            var timeVal2 = timeStr.split('-')[1];
            var startTime = convertTimeFrom12To24(timeVal1);
            var endTime = convertTimeFrom12To24(timeVal2);

            var guests = document.getElementById('inpGuests').value;
            startTime = dtStr+" "+startTime;
            endTime = dtStr+" "+endTime;

            if(localStorage.getItem("value") == "update")
            {
               bookingID = localStorage.getItem("bookingID"); 
               axios.put('https://aa430bqyd0.execute-api.us-east-1.amazonaws.com/prod/updateamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests, bookingID: bookingID})        
               .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Pool Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        localStorage.clear();
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })

                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Pool Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        
                    }
                    else
                    {
                        $('#myModalTitle').html('Pool Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                    }

                })
               .catch(function (error) {
                        $('#myModalTitle').html('Pool Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        console.log(error);
                });
            }
            else
            {
                axios.post('https://ikmq8orng7.execute-api.us-east-1.amazonaws.com/prod/insertamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests})        
                    .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Pool Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })
                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Pool Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show'); 
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                    else
                    {
                        $('#myModalTitle').html('Pool Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                  })
                  .catch(function (error) {
                        $('#myModalTitle').html('Pool Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                        console.log(error);
                  });
            }

            
        }


        function submitSpaBooking()
        {
            var serviceType = 'spa';
            //customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493";
            var customerID = sessionStorage.getItem('sub');

            var dtStr =  document.getElementById('inpDate').value;

            var timeStr = document.getElementById('inpTime').options[document.getElementById('inpTime').selectedIndex].text;

            var timeVal1 = timeStr.split('-')[0];
            var timeVal2 = timeStr.split('-')[1];
            var startTime = convertTimeFrom12To24(timeVal1);
            var endTime = convertTimeFrom12To24(timeVal2);

            var guests = document.getElementById('inpGuests').value;
            startTime = dtStr+" "+startTime;
            endTime = dtStr+" "+endTime;

            if(localStorage.getItem("value") == "update")
            {
               bookingID = localStorage.getItem("bookingID"); 
               axios.put('https://aa430bqyd0.execute-api.us-east-1.amazonaws.com/prod/updateamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests, bookingID: bookingID})        
               .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Spa Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        localStorage.clear();
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })

                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Spa Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        
                    }
                    else
                    {
                        $('#myModalTitle').html('Spa Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                    }

                })
               .catch(function (error) {
                        $('#myModalTitle').html('Spa Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        console.log(error);
                });
            }
            else
            {
                axios.post('https://ikmq8orng7.execute-api.us-east-1.amazonaws.com/prod/insertamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests})        
                    .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Spa Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })
                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Spa Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show'); 
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                    else
                    {
                        $('#myModalTitle').html('Spa Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                  })
                  .catch(function (error) {
                        $('#myModalTitle').html('Spa Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                        console.log(error);
                  });
            }

            
        }

        function submitLaundryBooking()
        {
            var serviceType = 'laundry';
            //customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493";
            var customerID = sessionStorage.getItem('sub');

            var dtStr =  document.getElementById('inpDate').value;

            var timeStr = document.getElementById('inpTime').options[document.getElementById('inpTime').selectedIndex].text;

            var timeVal1 = timeStr.split('-')[0];
            var timeVal2 = timeStr.split('-')[1];
            var startTime = convertTimeFrom12To24(timeVal1);
            var endTime = convertTimeFrom12To24(timeVal2);

            var guests = document.getElementById('inpGuests').value;
            startTime = dtStr+" "+startTime;
            endTime = dtStr+" "+endTime;

            if(localStorage.getItem("value") == "update")
            {
               bookingID = localStorage.getItem("bookingID"); 
               axios.put('https://aa430bqyd0.execute-api.us-east-1.amazonaws.com/prod/updateamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests, bookingID: bookingID})        
               .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Laundry Machine Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        localStorage.clear();
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })

                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Laundry Machine Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        
                    }
                    else
                    {
                        $('#myModalTitle').html('Laundry Machine Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                    }

                })
               .catch(function (error) {
                        $('#myModalTitle').html('Laundry Machine Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        console.log(error);
                });
            }
            else
            {
                axios.post('https://ikmq8orng7.execute-api.us-east-1.amazonaws.com/prod/insertamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests})        
                    .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Laundry Machine Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })
                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Laundry Machine Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show'); 
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                    else
                    {
                        $('#myModalTitle').html('Laundry Machine Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                  })
                  .catch(function (error) {
                        $('#myModalTitle').html('Laundry Machine Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                        console.log(error);
                  });
            }

            
        }


        function submitRestaurantBooking()
        {
            var serviceType = 'restaurant';
            //customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493";
            var customerID = sessionStorage.getItem('sub');

            var dtStr =  document.getElementById('inpDate').value;

            var timeStr = document.getElementById('inpTime').options[document.getElementById('inpTime').selectedIndex].text;

            var timeVal1 = timeStr.split('-')[0];
            var timeVal2 = timeStr.split('-')[1];
            var startTime = convertTimeFrom12To24(timeVal1);
            var endTime = convertTimeFrom12To24(timeVal2);

            var guests = document.getElementById('inpGuests').value;
            startTime = dtStr+" "+startTime;
            endTime = dtStr+" "+endTime;

            if(localStorage.getItem("value") == "update")
            {
               bookingID = localStorage.getItem("bookingID"); 
               axios.put('https://aa430bqyd0.execute-api.us-east-1.amazonaws.com/prod/updateamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests, bookingID: bookingID})        
               .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Restaurant Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        localStorage.clear();
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })

                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Restaurant Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        
                    }
                    else
                    {
                        $('#myModalTitle').html('Restaurant Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                    }

                })
               .catch(function (error) {
                        $('#myModalTitle').html('Restaurant Booking');
                        $('#myModalBody').html('Sorry there is some error. Please Try again.');
                        $('#myModal').modal('show');
                        document.getElementById('inpDate').value = localStorage.getItem("bookingDate");
                        document.getElementById('inpGuests').value = localStorage.getItem("guests");
                        timeVal = localStorage.getItem("timeSlotVal");
                        var inpTime = convertTimeFrom12To24(timeVal).split(':')[0];
                        document.getElementById('inpTime').value = inpTime;
                        console.log(error);
                });
            }
            else
            {
                axios.post('https://ikmq8orng7.execute-api.us-east-1.amazonaws.com/prod/insertamenitiesbooking', {customerID: customerID, serviceType: serviceType, startTime: startTime, endTime: endTime, bookedDate: dtStr, guests: guests})        
                    .then(function (response) {
                    if(response.data == 1)  
                    {
                        $('#myModalTitle').html('Restaurant Booking');
                        $('#myModalBody').html('Thank You! The amenity has been booked.');
                        $('#myModal').modal('show');
                        $('#myModal').on('hidden.bs.modal', function (e) {
                            window.location.href = "myOngoingTrip.html";
                        })
                    }
                    else if(response.data == 0)
                    {
                        $('#myModalTitle').html('Restaurant Booking');
                        $('#myModalBody').html('This slot has filled up. Please select another slot.');
                        $('#myModal').modal('show'); 
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                    else
                    {
                        $('#myModalTitle').html('Restaurant Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                    }
                  })
                  .catch(function (error) {
                        $('#myModalTitle').html('Restaurant Booking');
                        $('#myModalBody').html('Sorry there is some error. Try again.');
                        $('#myModal').modal('show');
                        setToday();
                        document.getElementById('inpTime').selectedIndex = 0;
                        document.getElementById('inpGuests').value = 1;
                        console.log(error);
                  });
            }

            
        }


        function convertTimeFrom12To24(timeStr) 
        {
            var colon = timeStr.indexOf(':');
            var hours = timeStr.substr(0, colon),
            minutes = timeStr.substr(colon+1, 2),
            meridian = timeStr.substr(colon+4, 2).toUpperCase();
     
      
            var hoursInt = parseInt(hours, 10),
            offset = meridian == 'PM' ? 12 : 0;
      
            if (hoursInt === 12) {
            hoursInt = offset;
            } 
            else {
            hoursInt += offset;
            }

            return hoursInt + ":" + minutes + ":00";
        }        
//redirect to dashboard.html page
const getDashboard = () =>{
    event.preventDefault();
    location.href = "dashboard.html"
};