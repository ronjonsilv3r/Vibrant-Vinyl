const { Client, Environment } = require('square');
require('dotenv').config(); // Ensure dotenv is configured and loaded

// Debugging: Print environment variables
console.log('SQUARE_ACCESS_TOKEN:', process.env.SQUARE_ACCESS_TOKEN);
console.log('SQUARE_LOCATION_ID:', process.env.SQUARE_LOCATION_ID);

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

async function createTestOrder() {
  try {
    const response = await client.ordersApi.createOrder({
      order: {
        locationId: process.env.SQUARE_LOCATION_ID, // Ensure this is correctly set
        lineItems: [
          {
            name: "Jamal Item",
            quantity: "1",
            basePriceMoney: {
              amount: 1000,
              currency: "USD"
            }
          }
        ],
        fulfillments: [
          {
            type: "PROPOSED.",//PICKUP, SHIPMENT, BETA
            state: "RESERVED",//PROPOSED, RESERVED, PREPARED, COMPLETED, CANCELED, FAILED https://developer.squareup.com/reference/square/objects/Fulfillment
            pickupDetails: {
              recipient: {
                displayName: "Test Tone"
              },
              pickupAt: new Date(new Date().getTime() + 3600000).toISOString() // current time + 1 hour
            }
          }
        ]
      }
    });

    console.log('Order creation response:', response.result);
  } catch (error) {
    console.error('Error creating order:', error);
  }
}

createTestOrder();
