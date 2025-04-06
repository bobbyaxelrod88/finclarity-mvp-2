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
    const labels = ["What's your name?", "How old are you?", "What’s your annual income?", "What’s your top financial goal?"];
    const keys = ['name', 'age', 'income', 'goal'];
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">{labels[step]}</h2>
          <input
            name={keys[step]}
            value={formData[keys[step]]}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Type your answer..."
          />
          <button
            onClick={() => setStep(step + 1)}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-blue-900">Welcome back, {formData.name} 👋</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">🤖 Ask FinClarity AI</h2>

          <div className="h-64 overflow-y-auto border border-gray-200 p-4 rounded bg-gray-50 space-y-3 text-sm">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-green-100 text-left'}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="italic text-gray-500 animate-pulse">FinClarity is thinking...</div>}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
              placeholder="Ask about taxes, investing, estate planning..."
            />
            <button
              onClick={handleChat}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">💸 Tax Optimization Simulator</h2>
          <p className="text-sm text-gray-500">*Coming soon*</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">📈 Retirement Calculator</h2>
          <p className="text-sm text-gray-500">*Coming soon*</p>
        </div>
      </div>
    </main>
  );
}

