function submitReviewRatings() {

    var txtReview = document.getElementById('txtReview').value;
    var rating = 0;
    //var customerID = "52508778-feaa-4f36-adf9-5bfd75f2d493";
    var customerID = sessionStorage.getItem('sub');

    if(document.getElementById('txtReview').value == "" && document.getElementById('rating1').checked == false && document.getElementById('rating2').checked == false && document.getElementById('rating3').checked == false && document.getElementById('rating4').checked == false && document.getElementById('rating5').checked == false)
    {
        $('#myModalTitle').html('Post Reviews and Ratings');
        $('#myModalBody').html('Please enter a review or a rating.');
        $('#myModal').modal('show');
    }
    else
    {
      if (document.getElementById('rating1').checked == true)
      {
          rating = 1;
      }
      if (document.getElementById('rating2').checked == true)
      {
          rating = 2;
      }
      if (document.getElementById('rating3').checked == true)
      {
          rating = 3;
      }
      if (document.getElementById('rating4').checked == true)
      {
          rating = 4;
      }
      if (document.getElementById('rating5').checked == true)
      {
          rating = 5;
      }
        
        

      axios.post('https://949uvp6xzi.execute-api.us-east-1.amazonaws.com/prod/insertreviewsratings', {customerID: customerID, reviewContent: txtReview, ratings: rating})        
          .then(function (response) {
          $('#myModalTitle').html('Post Reviews and Ratings');
          $('#myModalBody').html('Thank You for your review.');
          $('#myModal').modal('show');  
          $('#myModal').on('hidden.bs.modal', function (e) {
              localStorage.setItem('activeTab', '#nav-checkout');
              window.location.href = "myOngoingTrip.html";
          })
        })
        .catch(function (error) {
          console.log(error);
        });
    }

}
