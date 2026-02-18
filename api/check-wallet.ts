import type { VercelRequest, VercelResponse } from '@vercel/node';

// Your Google Sheet CSV URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFYMl4JRe7m1Ityp7RDb13P8wUoL3me4VWeL04YQfDAB4RryLXOwVNS54hATmcZ2cfF6ecSZnCsonf/pub?gid=0&single=true&output=csv';

export default async function handler(
req: VercelRequest,
res: VercelResponse
) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
return res.status(200).end();
}

if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const { wallet } = req.body;

if (!wallet || !/^0x[a-fA-F0-9]{40}$/i.test(wallet)) {  
  return res.status(400).json({ error: 'Invalid wallet address' });  
}  

// Fetch whitelist from Google Sheet  
const response = await fetch(SHEET_URL);  
const csvText = await response.text();  
  
// Parse CSV (skip header row)  
const lines = csvText.trim().split('\n').slice(1);  
  
// Find the wallet  
for (const line of lines) {  
  const [address, tier] = line.split(',').map(s => s.trim());  
    
  if (address.toLowerCase() === wallet.toLowerCase()) {  
    return res.status(200).json({   
      status: tier.toUpperCase()   
    });  
  }  
}  

// Not found  
return res.status(200).json({ status: 'NONE' });

} catch (error: any) {
console.error('Error checking wallet:', error);
return res.status(500).json({
error: 'Failed to check whitelist',
details: error.message
});
}
}
