import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define tools (functions)
const tools = [
  {
    type: "function",
    function: {
      name: "summarize_text",
      description: "Summarizes input text",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Text to summarize" }
        },
        required: ["text"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "translate_text",
      description: "Translates text to a target language",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Text to translate" },
          targetLang: { type: "string", description: "Target language (e.g. fr, es)" }
        },
        required: ["text", "targetLang"]
      }
    }
  }
];

// Local implementation of the tools
const functions = {
  summarize_text: ({ text }) => {
    return `Summary: ${text.split(' ').slice(0, 5).join(' ')}...`;
  },
  translate_text: ({ text, targetLang }) => {
    return `Translated to ${targetLang}: ${text}`;
  }
};

// Main export
export async function askGPT(prompt) {
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    tools
  });

  const toolCall = res.choices[0]?.message?.tool_calls?.[0];

  if (toolCall) {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);
    return functions[name](parsedArgs);
  }

  return res.choices[0].message.content;
}
