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

       url = 'https://sb50b378bi.execute-api.us-east-1.amazonaws.com/prod/getamenitiesforhotel?customerID='+customerID;
        axios.get(url)
          .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i][0] == 'restaurant')
        {
            let div = document.createElement('div');
            div.className = 'col-md-3 col-lg-3 col-sm-8';

            let card = document.createElement('div');
            card.className = 'card text-center border-secondary mb-3';
            card.style = 'max-width: 18rem;';

            let header = document.createElement('h5');
            header.className = 'card-header';
            header.innerText = 'Restaurant';

            let cardImg = document.createElement('div');
            cardImg.className = 'card-img';

            let img = document.createElement('img');
            img.className = 'img-fluid';
            img.src = 'Images/restaurant.png';
            img.style = 'width: 8rem; height: 8rem;';

            let cardFooter = document.createElement('div');
            cardFooter.className = 'card-footer';

            let a = document.createElement('a');
            a.className = 'btn btn-primary';
            a.href = 'restaurantBooking.html';
            a.innerText = 'Book a Table';

            cardImg.appendChild(img);
            cardFooter.appendChild(a);
            
            card.appendChild(header);
            card.appendChild(cardImg);
            card.appendChild(cardFooter);

            div.appendChild(card);

            var parentDiv = document.querySelector('#dvParent');
            parentDiv.appendChild(div);
        }
        else if(response.data[i][0] == 'spa')
        {
            let div = document.createElement('div');
            div.className = 'col-md-3 col-lg-3 col-sm-8';

            let card = document.createElement('div');
            card.className = 'card text-center border-secondary mb-3';
            card.style = 'max-width: 18rem;';

            let header = document.createElement('h5');
            header.className = 'card-header';
            header.innerText = 'Spa';

            let cardImg = document.createElement('div');
            cardImg.className = 'card-img';

            let img = document.createElement('img');
            img.className = 'img-fluid';
            img.src = 'Images/spa.png';
            img.style = 'width: 8rem; height: 8rem;';

            let cardFooter = document.createElement('div');
            cardFooter.className = 'card-footer';

            let a = document.createElement('a');
            a.className = 'btn btn-primary';
            a.href = 'spaBooking.html';
            a.innerText = 'Book a slot';

            cardImg.appendChild(img);
            cardFooter.appendChild(a);
            
            card.appendChild(header);
            card.appendChild(cardImg);
            card.appendChild(cardFooter);

            div.appendChild(card);

            var parentDiv = document.querySelector('#dvParent');
            parentDiv.appendChild(div);
        }
        else if(response.data[i][0] == 'laundry')
        {
            let div = document.createElement('div');
            div.className = 'col-md-3 col-lg-3 col-sm-8';

            let card = document.createElement('div');
            card.className = 'card text-center border-secondary mb-3';
            card.style = 'max-width: 18rem;';

            let header = document.createElement('h5');
            header.className = 'card-header';
            header.innerText = 'Laundry Service';

            let cardImg = document.createElement('div');
            cardImg.className = 'card-img';

            let img = document.createElement('img');
            img.className = 'img-fluid';
            img.src = 'Images/washing-machine.png';
            img.style = 'width: 8rem; height: 8rem;';

            let cardFooter = document.createElement('div');
            cardFooter.className = 'card-footer';

            let a = document.createElement('a');
            a.className = 'btn btn-primary';
            a.href = 'laundryBooking.html';
            a.innerText = 'Book a slot';

            cardImg.appendChild(img);
            cardFooter.appendChild(a);
            
            card.appendChild(header);
            card.appendChild(cardImg);
            card.appendChild(cardFooter);

            div.appendChild(card);

            var parentDiv = document.querySelector('#dvParent');
            parentDiv.appendChild(div);
        }
        else if(response.data[i][0] == 'pool')
        {
            let div = document.createElement('div');
            div.className = 'col-md-3 col-lg-3 col-sm-8';

            let card = document.createElement('div');
            card.className = 'card text-center border-secondary mb-3';
            card.style = 'max-width: 18rem;';

            let header = document.createElement('h5');
            header.className = 'card-header';
            header.innerText = 'Swimming Pool';

            let cardImg = document.createElement('div');
            cardImg.className = 'card-img';

            let img = document.createElement('img');
            img.className = 'img-fluid';
            img.src = 'Images/swimming-pool.png';
            img.style = 'width: 8rem; height: 8rem;';

            let cardFooter = document.createElement('div');
            cardFooter.className = 'card-footer';

            let a = document.createElement('a');
            a.className = 'btn btn-primary';
            a.href = 'poolBooking.html';
            a.innerText = 'Book a slot';

            cardImg.appendChild(img);
            cardFooter.appendChild(a);
            
            card.appendChild(header);
            card.appendChild(cardImg);
            card.appendChild(cardFooter);

            div.appendChild(card);

            var parentDiv = document.querySelector('#dvParent');
            parentDiv.appendChild(div);
        }
        else if(response.data[i][0] == 'gym')
        {
            let div = document.createElement('div');
            div.className = 'col-md-3 col-lg-3 col-sm-8';

            let card = document.createElement('div');
            card.className = 'card text-center border-secondary mb-3';
            card.style = 'max-width: 18rem;';

            let header = document.createElement('h5');
            header.className = 'card-header';
            header.innerText = 'Gym';

            let cardImg = document.createElement('div');
            cardImg.className = 'card-img';

            let img = document.createElement('img');
            img.className = 'img-fluid';
            img.src = 'Images/gym.png';
            img.style = 'width: 8rem; height: 8rem;';

            let cardFooter = document.createElement('div');
            cardFooter.className = 'card-footer';

            let a = document.createElement('a');
            a.className = 'btn btn-primary';
            a.href = 'gymBooking.html';
            a.innerText = 'Book a slot';

            cardImg.appendChild(img);
            cardFooter.appendChild(a);
            
            card.appendChild(header);
            card.appendChild(cardImg);
            card.appendChild(cardFooter);

            div.appendChild(card);

            var parentDiv = document.querySelector('#dvParent');
            parentDiv.appendChild(div);
        }

            }

          })
          .catch(function (error) {
        });
        

        });