import React, { useState } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

const ChatBox = styled.div`
  width: 100%;
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
  margin-bottom: 20px;
`;

const Message = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.isUser ? '#d1e7dd' : '#f8d7da')};
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const InputContainer = styled.form`
  display: flex;
  width: 100%;
`;

const TextInput = styled.textarea`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-right: 10px;
  resize: none;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const ChatGPTComponent = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const gptMessage = { role: 'assistant', content: data.choices[0].message.content };
      setMessages([...messages, userMessage, gptMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setError("Error: Unable to fetch response. Check console for details.");
    }
  };

  return (
    <ChatContainer>
      <ChatBox>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.role === 'user'}>
            {msg.content}
          </Message>
        ))}
      </ChatBox>
      <InputContainer onSubmit={handleSubmit}>
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          rows="3"
        />
        <SubmitButton type="submit">Send</SubmitButton>
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </ChatContainer>
  );
};

export default ChatGPTComponent;