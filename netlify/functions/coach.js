const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { userInput, phase } = JSON.parse(event.body);

    const prompt = `
You are a top-tier EOS Implementer helping a client turn a vague Rock into a SMART goal. 
Their current input is: "${userInput}". 

You're now focusing on making the goal "${phase}". 
Ask a single, thoughtful coaching question to guide them forward, without repeating the SMART acronym or being robotic. 
Be direct, clear, and act as if you're in an EOS session room aiming for traction.

Respond only with the question (no preamble, no postscript).
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a business coach guiding EOS clients." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (error) {
    console.error("OpenAI error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ response: "There was a problem generating AI guidance." }),
    };
  }
};
