import React, { useState } from "react";
import styled from "styled-components";
import Groq from "groq-sdk";

const AppContainer = styled.div`
  background: linear-gradient(to right, #ece9e6, #ffffff);
  height: 100vh;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

const FormContainer = styled.form`
  width: 100%;
  max-width: 600px;
  background: #f9fafb;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Textarea = styled.textarea`
  width: 95%;
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: none;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #2980b9;
  }
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const AnswerContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background: #f9fafb;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  text-align: left;
`;

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const groq = new Groq({
    apiKey: 'api key',
    dangerouslyAllowBrowser: true, 
  });

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take up to 10 seconds");
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        model: "llama3-8b-8192",
      });
      const generatedAnswer =
        chatCompletion.choices[0]?.message?.content || "No response generated";
      setAnswer(generatedAnswer);
    } catch (error) {
      console.error(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  return (
    <AppContainer>
      <FormContainer onSubmit={generateAnswer}>
        <Title>Chat AI</Title>
        <Textarea
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything"
        ></Textarea>
        <Button type="submit" disabled={generatingAnswer}>
          Generate answer
        </Button>
      </FormContainer>
      <AnswerContainer>
        <p>{answer}</p>
      </AnswerContainer>
    </AppContainer>
  );
}

export default App;
