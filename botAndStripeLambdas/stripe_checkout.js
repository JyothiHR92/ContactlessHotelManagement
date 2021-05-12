'use strict';
//var cors = require('cors')

const ApiBuilder = require('claudia-api-builder'),
      api = new ApiBuilder();
const  stripe=require('stripe')('sk_test_51HkLZVHY6O1ZvdQlLmQi7r156r1RakhbyIDIwxJ3b76H9lwqGIjSSJzqyqYuzYgpWXnIjWx0JK2c9KBTMPOgXHG800SvfnO5Pv');
const qs = require('querystring');
//const bodyParser = require("body-parser");


const DOMAIN = 'http://ezeehotel.s3-website-us-east-1.amazonaws.com';

api.get('/checkout-session', async(req, res)=> {
    const session = await stripe.checkout.sessions.retrieve(req.queryString.sessionId);
   return {
  //      sessionInfo : session
          session_customer_id: session.client_reference_id,
          session_customer_userName: session.metadata.user,
          session_id:session.id,
          session_amount: session.amount_total/100
   };
  })

api.post('/create-checkout-session', async (req, res) => {

  const session = await stripe.checkout.sessions.create({
    //success_url: `http://ezeehotel.s3-website-us-east-1.amazonaws.com/success.html?session_id={CHECKOUT_SESSION_ID}`,
    //cancel_url: `http://ezeehotel.s3-website-us-east-1.amazonaws.com/canceled.html`,
    success_url: `http://ezeehotel.com/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://ezeehotel.com/canceled.html`,
    payment_method_types: ['card'],
    mode: 'payment',
    client_reference_id : req.body.customerID,
    metadata : { user : req.body.userName } ,
    line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stay Charges',
            //images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: req.body.price*100,
        },
        quantity: 1,
        dynamic_tax_rates: ['txr_1IWeg8HY6O1ZvdQlfQdK6krj', 'txr_1IWeghHY6O1ZvdQl827M3bqf'],
      }],
  });
  return {
    id: session.id
  };
});

module.exports = api;