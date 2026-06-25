require('dotenv').config({ path: '.env.local' });

async function checkModel() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  // Test v1 API
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello" }] }]
    })
  });
  
  const data = await response.json();
  console.log("v1 response:", JSON.stringify(data, null, 2));
}

checkModel();
