const { Client, Environment } = require('square');
require('dotenv').config();

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox, // Use Environment.Production for production
});

async function listLocations() {
  try {
    const response = await client.locationsApi.listLocations();
    const locations = response.result.locations;
    
    locations.forEach(location => {
      console.log(`Location Name: ${location.name}`);
      console.log(`Location ID: ${location.id}`);
      console.log('=======================');
    });
  } catch (error) {
    console.error(error);
  }
}

listLocations();
