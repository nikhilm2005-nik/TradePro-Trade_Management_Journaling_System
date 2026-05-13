// test.js
async function runTest() {
  console.log("🚀 Starting API Test...\n");

  // 1. Create a new trade
  console.log("📝 1. Attempting to create a trade...");
  const createRes = await fetch("http://localhost:5000/api/trades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ticker: "AAPL",
      direction: "LONG",
      entryDate: new Date().toISOString(),
      entryPrice: 150.25,
      size: 10,
      setup: "Moving Average Bounce",
      notes: "Testing my new backend!"
    }),
  });
  
  const createdTrade = await createRes.json();
  console.log("✅ Trade Created successfully!");
  console.log(createdTrade);

  // 2. Fetch all trades to verify
  console.log("\n🔍 2. Fetching all trades from database...");
  const fetchRes = await fetch("http://localhost:5000/api/trades");
  const allTrades = await fetchRes.json();
  
  console.log(`✅ Retrieved ${allTrades.length} trade(s) from the database!`);
  console.log(allTrades);
}

runTest();