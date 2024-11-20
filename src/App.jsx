import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxTokens, setMaxTokens] = useState(500);

  // const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY; ////
  const openaiApiKey = process.env.VITE_OPENAI_API_KEY; ////

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null); // Clear previous response when a new request is made

    // Validate max tokens input
    if (maxTokens < 1 || maxTokens > 2000 || isNaN(maxTokens)) {
      alert("Please enter a valid number between 1 and 2000 for max tokens.");
      setLoading(false);
      return;
    }

    try {
      // Prepare the prompt for GPT
      const prompt = `You are an assistant. Please answer the following question:\nUser question: ${input}`;

      // Send request to OpenAI API (using gpt-4o-mini as the model)
      const gptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(gptResponse.data.choices[0]?.message?.content || "No response");
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Chat with GPT</h1>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="search-form">
          <textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <div className="input-options">
            <label>Max Tokens:</label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              min="1"
              max="2000"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Generate Response"}
          </button>
        </form>

        {loading && <div className="loading-message">Generating response...</div>}

        {response && !loading && (
          <div className="response">
            <h2>Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Chat with GPT on web application using the API.</p>
      </footer>
    </div>
  );
};

export default App;
