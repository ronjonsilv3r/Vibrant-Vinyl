
const express = require('express');
const { Client, Environment } = require('square');
require('dotenv').config();

const app = express();
const port = 3000;

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
  //environment: Environment.Production,
});

// Fetch orders from Square API
async function fetchOrders() {
  try {
    const response = await client.ordersApi.searchOrders({
      locationIds: [process.env.SQUARE_LOCATION_ID]
    });

    if (!response.result || !response.result.orders) {
      throw new Error('No orders found in the response');
    }

    const orders = response.result.orders.map(order => {
      const fulfillment = order.fulfillments && order.fulfillments[0] ? order.fulfillments[0] : {};
      const pickupDetails = fulfillment.pickupDetails || {};
      const recipientName = pickupDetails.recipient ? pickupDetails.recipient.displayName.split(' ') : ['Unknown', ''];
      
      return {
        id: order.id,
        customerFirstName: recipientName[0],
        customerLastName: recipientName[1] || '',
        date: order.createdAt,
        status: fulfillment.state,
        canceledAt: fulfillment.canceledAt,
        rejectedAt: fulfillment.rejectedAt,
        readyAt: pickupDetails.readyAt,
        pickupAt: pickupDetails.pickupAt,
        acceptedAt: pickupDetails.acceptedAt,   
      };
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Route to get orders
app.get('/orders', async (req, res) => {
  const orders = await fetchOrders();
  res.json({ orders });
});

// Serve static HTML file
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

/*


*/