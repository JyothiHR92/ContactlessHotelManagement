const book = () => {
  var stripe = Stripe(stripeKey.STRIPE_PUB_KEY);
  //let button =document.getElementById('btn');
  let price = document.getElementById('sum');
  console.log(price.innerHTML);
  //let price = 40.5;
  let customerID = sessionStorage.getItem('sub');

  event.preventDefault();
  const params = JSON.stringify({
      "price": price.innerHTML,
      "customerID": customerID,
    });
//https://abpi6gz5hb.execute-api.us-east-1.amazonaws.com/latest
//https://jv1jisy2ri.execute-api.us-east-1.amazonaws.com/latest
  axios.post('https://jv1jisy2ri.execute-api.us-east-1.amazonaws.com/latest/create-checkout-session', params, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    stripe.redirectToCheckout({sessionId: response.data.id});
    console.log('Success:', data);
    })
  .catch((error) => {
    console.error('Error:', error);
    return false;
  });

//https://o09hgaf18i.execute-api.us-east-1.amazonaws.com/latest
//https://nw87o9upt0.execute-api.us-east-1.amazonaws.com/latest
 axios.post('https://nw87o9upt0.execute-api.us-east-1.amazonaws.com/latest/updatePayment', params, {
      headers: {
      'Content-Type': 'application/json',
      },
  })
  .then((response) => {
    console.log("PD",response); 
  })
  .catch((error) => {
    console.log('Error:', error);
  });
  axios.post('https://nw87o9upt0.execute-api.us-east-1.amazonaws.com/latest/updateConcierge', params, {
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log("UC", response)
      })
      .catch((error) => {
        console.log('Error:', error);
      });

  axios.post('https://nw87o9upt0.execute-api.us-east-1.amazonaws.com/latest/checkout', params, {
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log("CO", response)
      })
      .catch((error) => {
        console.log('Error:', error);
      });


};
  