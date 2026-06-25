const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

const rawData = fs.readFileSync('nextgen_content.json', 'utf8');
const topics = JSON.parse(rawData);

async function generateContentForTopic(topic, id) {
  const prompt = `You are a bar exam tutor creating premium review cards. 
I have a syllabus topic for the NextGen Bar Exam:
Category: ${topic.category}
Sub-Topic: ${topic.sub_topic_module_tag}
Core Doctrine: ${topic.core_pure_recall_doctrine}

Please provide the detailed educational content for this topic in JSON format matching this structure exactly:
{
  "trigger": "A 1-2 sentence scenario that triggers this rule.",
  "notes": "A concise 2-4 sentence explanation of the black letter law that a student needs to memorize.",
  "commonVsModern": "Optional. Only include if there is a distinction between common law and modern/UCC law. Otherwise leave as empty string."
}
Return ONLY valid JSON.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        response_mime_type: "application/json"
      }
    })
  });

  const data = await response.json();
  if (data.error) {
    console.error("API Error:", data.error.message);
    if (data.error.code === 429) {
      console.log("Rate limited, waiting 10 seconds...");
      await new Promise(r => setTimeout(r, 10000));
      return generateContentForTopic(topic, id); // Retry
    }
  }

  try {
    const text = data.candidates[0].content.parts[0].text;
    const generated = JSON.parse(text);
    return {
      id: id,
      subject: `${topic.category} - ${topic.sub_topic_module_tag}`,
      rule: topic.core_pure_recall_doctrine,
      trigger: generated.trigger,
      notes: generated.notes,
      commonVsModern: generated.commonVsModern || "",
      date: new Date().toISOString()
    };
  } catch (err) {
    console.error("Error parsing response for", topic.core_pure_recall_doctrine, err);
    return null;
  }
}

async function main() {
  console.log(`Starting generation for ${topics.length} topics...`);
  const fullTopics = [];
  
  // We'll process them in small batches to avoid rate limits
    const BATCH_SIZE = 2; // Reduced batch size
  for (let i = 0; i < topics.length; i += BATCH_SIZE) {
    const batch = topics.slice(i, i + BATCH_SIZE);
    const promises = batch.map((t, index) => generateContentForTopic(t, i + index + 1));
    const results = await Promise.all(promises);
    
    results.forEach(res => {
      if (res) fullTopics.push(res);
    });
    
    console.log(`Processed ${i + batch.length} / ${topics.length}`);
    // Sleep longer to avoid rate limits (15 RPM free tier limit)
    await new Promise(r => setTimeout(r, 4000));
  }

  // Generate the TypeScript file content
  const tsContent = `import { Topic } from "@/types";

export const initialData: Topic[] = ${JSON.stringify(fullTopics, null, 2)};
`;

  fs.writeFileSync('src/data/mockTopics.ts', tsContent, 'utf8');
  console.log("Successfully wrote src/data/mockTopics.ts");
}

main().catch(console.error);
