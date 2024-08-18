const { Client, Environment } = require('square');
require('dotenv').config();

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox, // Use Environment.Production for production
});

async function listAllOrders() {
  try {
    const locationId = process.env.SQUARE_LOCATION_ID;
    const orders = [];
    let cursor = undefined;

    do {
      const response = await client.ordersApi.searchOrders({
        locationIds: [locationId],
        cursor: cursor
      });
      
      if (response.result.orders) {
        orders.push(...response.result.orders);
      }
      cursor = response.result.cursor;
    } while (cursor);

    console.log('Orders:', orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

listAllOrders();
