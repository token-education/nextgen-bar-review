import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30; // Allow response to take up to 30 seconds

export async function POST(req: Request) {
  const { messages, contextTopics } = await req.json();

  const systemPrompt = `You are a rigorous Blackletter Law Drill Instructor for the NextGen Washington Bar Exam. 
The user is struggling with the following topics:
${contextTopics && contextTopics.length > 0 ? contextTopics.map((t: any) => `- ${t.subject}: ${t.rule}`).join('\n') : 'No specific unmastered topics provided. Pick standard Bar Exam topics.'}

YOUR DIRECTIVE:
1. Do not ask what the user wants to practice. 
2. Immediately pick ONE of the unmastered topics and test their exact memorization of the blackletter law for that rule. 
3. Ask them to define the rule, state the elements, or fill in the blanks of the rule definition.
4. Wait for their answer.
5. Grade them strictly on accuracy to the blackletter law. Correct their mistakes, then immediately ask them the next rule definition question.
Keep your responses concise, focused entirely on drilling the exact rules.`;

  const result = streamText({
    model: google('gemini-2.5-flash'), // or gemini-2.5-pro
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
