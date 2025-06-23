// netlify/functions/coach.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { userInput, phase } = body;

    console.log("➡️ Received prompt:", userInput);
    console.log("➡️ SMART Phase:", phase);

    const prompt = `
You are a business coach helping a client improve a vague quarterly goal (called a "Rock" in EOS). 
The user is currently refining the goal to make it SMART. Your task is to guide them with one specific, concise coaching question 
based on the current phase: ${phase}.

Rock so far: ${userInput}

Ask only one focused question to help improve this phase.
`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a business coach helping users improve vague Rocks into SMART goals. Be practical, focused, and concise.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const message = chatResponse.choices[0].message.content.trim();
    console.log("✅ GPT response:", message);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: message }),
    };
  } catch (err) {
    console.error("❌ Error in coach.js:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error: could not process AI prompt." }),
    };
  }
};
