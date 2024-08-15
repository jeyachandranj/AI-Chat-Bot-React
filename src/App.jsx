import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import ReactMarkdown from "react-markdown";

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

const AnswerText = styled(ReactMarkdown)`
  padding: 1rem;
  font-size: 1rem;
`;

const MessageContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 1rem;
  background: #f9fafb;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Message = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
`;

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [messages, setMessages] = useState([]);


  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take up to 10 seconds");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });
      const generatedAnswer =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setAnswer(generatedAnswer);
    } catch (error) {
      console.log(error);
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
        <AnswerText>{answer}</AnswerText>
      </AnswerContainer>
    </AppContainer>
  );
}
export default App;