const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const { userInput, phase } = body;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const prompt = `You're helping someone refine their EOS Rock using the SMART framework.
Step: ${phase}
Input so far: ${userInput}
Return a helpful prompt to get more clarity on the ${phase} dimension.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = completion.data.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ response: aiResponse }),
    };
  } catch (err) {
    console.error("AI error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI error", detail: err.message }),
    };
  }
};
