
// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', age: '', income: '', goal: '' });
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleChat = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...chatHistory, userMessage], userProfile: formData }),
    });

    const data = await res.json();
    setLoading(false);
    setChatHistory((prev) => [...prev, { role: 'assistant', content: data.reply }]);
  };

  if (step < 4) {
  const questions = [
    "What's your name?",
    "How old are you?",
    "What’s your annual income?",
    "What’s your top financial goal?"
  ];
  const keys = ['name', 'age', 'income', 'goal'];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-6 text-center">
        {/* ✅ Step Label */}
        <div className="text-sm text-gray-500">Step {step + 1} of 4</div>

        {/* ✅ Question Heading */}
        <h2 className="text-2xl font-bold text-gray-800">{questions[step]}</h2>

        {/* ✅ Input Field */}
        <input
          name={keys[step]}
          value={formData[keys[step]]}
          onChange={handleChange}
          placeholder="Type your answer..."
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ✅ Next Button */}
        <button
          onClick={() => setStep(step + 1)}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Next
        </button>

        {/* ✅ Dot Stepper */}
        <div className="flex justify-center space-x-2 pt-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i === step ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
