import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', age: '', income: '', goal: '' });
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleChat = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...chatHistory, userMessage], userProfile: formData }),
    });
    const data = await res.json();
    setChatHistory((prev) => [...prev, { role: 'assistant', content: data.reply }]);
  };

  if (step < 4) {
    const labels = ["What's your name?", "How old are you?", "What’s your annual income?", "What’s your top financial goal?"];
    const keys = ['name', 'age', 'income', 'goal'];
    return (
      <main style={{ padding: 24 }}>
        <h2>{labels[step]}</h2>
        <input name={keys[step]} value={formData[keys[step]]} onChange={handleChange} />
        <button onClick={() => setStep(step + 1)}>Next</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Welcome, {formData.name} 👋</h1>
      <div style={{ height: 200, overflowY: 'auto', border: '1px solid #ccc', padding: 12 }}>
        {chatHistory.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.content}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about investing, taxes, estate..." />
      <button onClick={handleChat}>Send</button>
    </main>
  );
}
