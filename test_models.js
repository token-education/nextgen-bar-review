require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.models) {
    console.log("Available models:", data.models.map(m => m.name).join(", "));
  } else {
    console.log("Response:", data);
  }
}

listModels();
