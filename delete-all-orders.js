const { Client, Environment } = require('square');
require('dotenv').config();

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Sandbox,  // Change to Environment.Production for live data
});

async function deleteAllOrders() {
    try {
        const locationId = process.env.SQUARE_LOCATION_ID;
        let cursor = undefined;

        // Rate limiting: Process in batches of 100 with a delay
        const batchSize = 100;
        const delayBetweenBatches = 1000; // 1 second delay

        do {
            const response = await client.ordersApi.searchOrders({
                locationIds: [locationId],
                cursor: cursor,
                limit: batchSize
            });

            if (response.result.orders && response.result.orders.length > 0) {
                for (const order of response.result.orders) {
                    const orderId = order.id;

                    // (Optional) Delete custom attributes before deleting the order
                    await deleteCustomAttributes(orderId);

                    await client.ordersApi.destroyOrder(orderId);
                    console.log(`Order ${orderId} deleted.`);
                }

                // Delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
            } else {
                console.log('No more orders found.');
            }

            cursor = response.result.cursor;
        } while (cursor);

        console.log('All orders deleted successfully!');
    } catch (error) {
        console.error('Error deleting orders:', error);
    }
}

// Function to delete custom attributes (optional)
async function deleteCustomAttributes(orderId) {
    try {
        const attributesToDelete = {
            'table-number': { key: 'table-number', orderId }, // Add more attributes as needed
            'cover-count': { key: 'cover-count', orderId }
        };
        
        await client.orderCustomAttributesApi.bulkDeleteOrderCustomAttributes({
            values: attributesToDelete
        });
    } catch (error) {
        console.error(`Error deleting custom attributes for order ${orderId}:`, error);
        // Handle the error appropriately (e.g., log, continue deleting orders, etc.)
    }
}

deleteAllOrders();
