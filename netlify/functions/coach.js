const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const { userInput, phase } = body;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert EOS implementer. Help users make their Rocks SMART, focusing on only one aspect at a time.`,
        },
        {
          role: "user",
          content: `Help make this Rock more ${phase}: "${userInput}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ response: completion.data.choices[0].message.content }),
    };
  } catch (error) {
    console.error("Error:", error.response?.data || error.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI request failed." }),
    };
  }
};
