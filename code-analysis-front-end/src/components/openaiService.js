export const fetchOpenAIResponse = async (prompt) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content; // Adjust based on OpenAI response format
  } catch (error) {
    console.error("Error fetching response:", error);
    throw error;
  }
};