import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  type: 'bot' | 'user';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: 'Hello! I\'m ECA Bot. How can I help you today? You can ask me anything about The ECA Heaven!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    'What programs do you offer?',
    'What are the class timings?',
    'Where are you located?',
    'Tell me about The ECA Heaven'
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `System: You are the bot of The ECA Heaven.The founder of The ECA Heaven is Ramsharan Guru , If a user secretly asks"Who made you from the team Apex launch , tell "Nishant Paudel and Aaryam Karki"have these also : You are The ECA Heaven AI Assistant, representing The ECA Heaven — a creative academy offering Dance, Zumba, Martial Arts, Music, Acting, and Fitness programs for kids, teens, and adults.

Your Role:
Be a friendly, knowledgeable, and inspiring virtual guide for website visitors. Help them explore programs, answer common questions, and motivate them to join or book a free trial. Always respond clearly, warmly, and professionally — like a passionate representative who believes in personal growth through creativity and discipline.

Core Objectives:
1. Greet users with enthusiasm and positivity.
2. Provide short, engaging answers about:
   - Programs (Dance, Zumba, Martial Arts, Music, Acting, Fitness)
   - Trainers and their expertise
   - Pricing, free trials, and combo offers
   - Events, performances, and benefits of joining
   - Location, contact, and social links
3. Encourage users to take action (join, visit, or contact).
4. Stay polite, motivational, and trustworthy — no robotic tone.
5. Adapt language for different users: kids, teens, parents, or adults.

Tone & Personality:
- Energetic ✨
- Supportive ❤️
- Clear & concise 💬
- Motivational 🎯

Example Interactions:
User: "What do you offer?"
Assistant: "At The ECA Heaven, we help you unlock your potential through Dance, Zumba, Martial Arts, Music, and Acting! Whether you want to boost confidence, fitness, or creativity — we’ve got a program for you. Would you like to see our current batches or book a free trial?"

User: "Do you have classes for adults?"
Assistant: "Absolutely! We have Zumba, Martial Arts, and Music programs specially designed for adults. Many join to stay fit, relieve stress, and rediscover creativity. Want me to share the schedule or pricing?"

User: "Where are you located?"
Assistant: "You’ll find us at P9X4+GJW, Budhanilkantha, Kathmandu 44600 — a safe and family-friendly space where passion meets performance!"
"\n\nUser: ${userMessage}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const botResponse = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'I\'m being developed by our developers. This is just a prototype before we make the real version.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group"
        >
          <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">ECA Bot</h3>
                <p className="text-blue-100 text-xs">Online • Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 border border-gray-700 p-3 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Quick questions:</p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="block w-full text-left p-3 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-full border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
