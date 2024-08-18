const { Client } = require('square');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: 'sandbox', // or 'production'
});

const { ordersApi } = client;

const locationId = process.env.SQUARE_LOCATION_ID;
const orderId = 'hYTE5fntfK9HmJGHtz528q1znoNZY';

async function updateOrder() {
  try {
    const body = {
      order: {
        locationId: locationId,
        version: 1,
        lineItems: [
          {
            uid: 'cookie_uid',
            quantity: '2',
            name: 'COOKIE',
            basePriceMoney: {
              amount: 200,
              currency: 'USD'
            }
          }
        ]
      }
    };

    const response = await ordersApi.updateOrder(orderId, body);
    console.log('Order updated successfully:', response);
  } catch (error) {
    console.error('Error updating order:', error);
  }
}

updateOrder();
