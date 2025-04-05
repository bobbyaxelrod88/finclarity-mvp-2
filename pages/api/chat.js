export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { messages, userProfile } = req.body;

  const systemPrompt = `You are a helpful, friendly AI financial advisor.
You offer educational guidance on investing, tax strategy, and estate planning.
You do not provide specific investment advice or manage assets.
Always include context and explain the why.

User Profile:
Name: ${userProfile.name}
Age: ${userProfile.age}
Income: ${userProfile.income}
Goal: ${userProfile.goal}`;

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      })
    });
    const json = await completion.json();
    const reply = json.choices?.[0]?.message?.content || "Sorry, I couldn’t generate a response.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
}
