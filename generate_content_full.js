const { generateText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const fs = require('fs');

require('dotenv').config({ path: '.env.local' });

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const sampleTopics = require('./nextgen_content.json');

const PROMPT_TEMPLATE = `
You are a master Bar Exam instructor optimizing for spaced repetition (the Minimum Information Principle). 
Your task is to take a complex bar exam doctrine and break it down into a cluster of 3 to 4 highly targeted "micro-cards".

Strictly ensure that your answer applies ONLY to the specified Subject/Category. Do NOT let doctrines from other subjects bleed into this card.

SUBJECT LOCK: 
Category: {category}
Sub-Topic: {sub_topic}

DOCTRINE TO ATOMIZE:
{doctrine}

CONSTRAINTS:
1. Atomize the Data: Do not generate comprehensive 'mega-cards'. Break this doctrine down into 3-4 distinct micro-cards (e.g. one for purpose, one for timing/waiver, one for conversion to summary judgment).
2. One Rule Per Card: A single flashcard must test only one specific rule, element, or procedural exception at a time.
3. Focused Front Prompts: The 'question' must ask a single, narrow question that directly corresponds to the atomized rule on the back.
4. Maintain UI Structure: Use a short 'trigger' fact pattern and bulleted 'notes' with **bolded** core elements and shifting burdens. No walls of text.

Return ONLY a valid JSON array of objects matching this schema (do NOT use markdown \`\`\`json block, just raw JSON text):
[
  {
    "question": "string (An active, narrow question testing ONE specific rule)",
    "trigger": "string (A short, 1-2 sentence contextual fact pattern)",
    "notes": "string (Scannable markdown bullet points. **Core elements** and **shifting burdens** MUST be in bold. No walls of text.)"
  }
]
`;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log(`Starting full rate-limited generation for ${sampleTopics.length} topics...`);
  let finalResults = [];
  let idCounter = 1;
  
  for (let i = 0; i < sampleTopics.length; i++) {
    const topic = sampleTopics[i];
    const prompt = PROMPT_TEMPLATE
      .replace('{category}', topic.category)
      .replace('{sub_topic}', topic.sub_topic_module_tag)
      .replace('{doctrine}', topic.core_pure_recall_doctrine);
      
    try {
      console.log(`Generating ${i + 1}/${sampleTopics.length}: ${topic.core_pure_recall_doctrine}...`);
      const { text } = await generateText({
        model: google('models/gemini-2.5-flash'),
        prompt,
      });
      
      let cleanText = text.trim();
      if (cleanText.startsWith('\`\`\`json')) cleanText = cleanText.substring(7);
      if (cleanText.startsWith('\`\`\`')) cleanText = cleanText.substring(3);
      if (cleanText.endsWith('\`\`\`')) cleanText = cleanText.substring(0, cleanText.length - 3);
      
      const parsedArray = JSON.parse(cleanText.trim());
      
      for (const parsed of parsedArray) {
        finalResults.push({
          id: idCounter++,
          subject: `${topic.category} - ${topic.sub_topic_module_tag}`,
          rule: topic.core_pure_recall_doctrine,
          question: parsed.question,
          trigger: parsed.trigger,
          notes: parsed.notes,
          commonVsModern: "",
          mastered: false,
          date: new Date().toISOString()
        });
      }
      
      // Delay for 13 seconds between requests to ensure we stay under the 5 RPM Free Tier limit
      console.log('Waiting 13 seconds for rate limit...');
      await delay(13000); 
    } catch (err) {
      console.error(`Failed to generate topic ${i + 1}`, err);
      // Wait extra long on failure before continuing
      await delay(30000);
    }
  }

  const outputContent = `import { Topic } from "@/types";

export const initialData: Topic[] = ${JSON.stringify(finalResults, null, 2)};
`;

  fs.writeFileSync('./src/data/mockTopics.ts', outputContent);
  console.log(`Full generation complete! Wrote ${finalResults.length} micro-cards to src/data/mockTopics.ts`);
}

run();
