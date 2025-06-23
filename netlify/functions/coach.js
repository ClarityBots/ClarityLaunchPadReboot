// netlify/functions/coach.js

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { userInput, phase } = JSON.parse(event.body);

    console.log("📥 Incoming userInput:", userInput);
    console.log("📥 Current phase:", phase);

    const prompt = `
You are a top-tier EOS Implementer helping a client turn a vague Rock into a SMART goal. 
Their current input is: "${userInput}". 

You're now focusing on making the goal "${phase}". 
Ask a single, thoughtful coaching question to guide them forward, without repeating the SMART acronym or being robotic. 
Be direct, clear, and act as if you're in an EOS session room aiming for traction.

Respond only with the question (no preamble, no postscript).
    `.trim();

    console.log("🧠 Full AI prompt:", prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a business coach guiding EOS clients." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const response = completion.data.choices[0].message.content.trim();
    console.log("🤖 AI response:", response);

    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (error) {
    console.error("🔥 Error in coach.js:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ response: "There was a problem generating AI guidance." }),
    };
  }
};
