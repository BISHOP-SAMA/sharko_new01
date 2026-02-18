// api/check-wallet.ts

// Your Google Sheet CSV URL
const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFYMl4JRe7m1Ityp7RDb13P8wUoL3me4VWeL04YQfDAB4RryLXOwVNS54hATmcZ2cfF6ecSZnCsonf/pub?gid=0&single=true&output=csv';

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
};

type NetlifyContext = any;

export async function handler(event: NetlifyEvent, context: NetlifyContext) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse JSON body
    const { wallet } = JSON.parse(event.body || '{}');

    if (!wallet || !/^0x[a-fA-F0-9]{40}$/i.test(wallet)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid wallet address' }),
      };
    }

    // Fetch CSV
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();

    const lines = csvText.trim().split('\n').slice(1);

    for (const line of lines) {
      const [address, tier] = line.split(',').map((s) => s.trim());
      if (address.toLowerCase() === wallet.toLowerCase()) {
        return {
          statusCode: 200,
          body: JSON.stringify({ status: tier.toUpperCase() }),
          headers: { 'Access-Control-Allow-Origin': '*' },
        };
      }
    }

    // Wallet not found
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'NONE' }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  } catch (error: any) {
    console.error('Error checking wallet:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to check whitelist',
        details: error.message,
      }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  }
}
