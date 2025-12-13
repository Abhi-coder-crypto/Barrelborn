const categories = [
  "nibbles",
  "titbits",
  "soups",
  "salads",
  "starters",
  "charcoal",
  "pasta",
  "pizza",
  "sliders",
  "entree",
  "bao-dimsum",
  "curries",
  "biryani",
  "rice",
  "dals",
  "breads",
  "asian-mains",
  "thai-bowls",
  "rice-noodles",
  "sizzlers",
  "blended-whisky",
  "blended-scotch-whisky",
  "american-irish-whiskey",
  "single-malt-whisky",
  "vodka",
  "gin",
  "rum",
  "tequila",
  "cognac-brandy",
  "liqueurs",
  "sparkling-wine",
  "white-wines",
  "rose-wines",
  "red-wines",
  "dessert-wines",
  "port-wine",
  "signature-mocktails",
  "soft-beverages"
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(categories);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
