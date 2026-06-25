const fs = require('fs');
const sampleTopics = require('./nextgen_content.json');

console.log(`Starting mock generation for ${sampleTopics.length} topics...`);

let finalResults = [];
let idCounter = 1;

for (const topic of sampleTopics) {
  // Generate 3 mock micro-cards per doctrine to simulate the Minimum Information Principle
  const doctrines = [
    {
      question: `What is the core rule regarding ${topic.core_pure_recall_doctrine}?`,
      trigger: "A standard fact pattern triggering this specific doctrine.",
      notes: `*   This is the foundational principle for **${topic.core_pure_recall_doctrine}**.\n*   The **core element** requires specific conditions to be met.\n*   **Burden of Proof**: The plaintiff usually bears the **burden** here.`
    },
    {
      question: `What are the primary exceptions to ${topic.core_pure_recall_doctrine}?`,
      trigger: "An alternate scenario where the standard rule might not apply.",
      notes: `*   Generally, the rule applies unless **specific exceptions** are met.\n*   A common exception involves **procedural waivers**.\n*   **Shifting Burden**: If the exception is claimed, the defendant bears the **burden of persuasion**.`
    },
    {
      question: `How does ${topic.core_pure_recall_doctrine} interact with related rules in ${topic.category}?`,
      trigger: "A complex scenario involving multiple overlapping rules.",
      notes: `*   When applying this rule, courts also look at **contextual factors**.\n*   **Timing**: This must be raised at the **earliest possible opportunity**.\n*   Failure to adhere results in **strict waiver** of the claim.`
    }
  ];
  
  for (const parsed of doctrines) {
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
}

const outputContent = `import { Topic } from "@/types";

export const initialData: Topic[] = ${JSON.stringify(finalResults, null, 2)};
`;

fs.writeFileSync('./src/data/mockTopics.ts', outputContent);
console.log(`Mock generation complete! Wrote ${finalResults.length} micro-cards to src/data/mockTopics.ts`);
