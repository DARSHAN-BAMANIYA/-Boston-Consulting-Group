import React, { useState, useRef, useEffect } from 'react';
import { Send, TrendingUp, Sparkles, RefreshCcw } from 'lucide-react';
import { Message, LoadingState } from './types';
import { MessageBubble } from './components/MessageBubble';
import { sendMessageToGemini } from './services/geminiService';
import { PREDEFINED_QUERIES } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm FinSight, your AI financial analyst. I've analyzed the 2023 fiscal reports. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim() || loadingState === LoadingState.LOADING) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoadingState(LoadingState.LOADING);

    try {
      const response = await sendMessageToGemini(text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        chartData: response.showChart ? response.chartData : undefined,
        chartType: response.chartType,
        chartTitle: response.chartTitle,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoadingState(LoadingState.IDLE);
      // Refocus input for better UX
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Session reset. I'm ready for new questions regarding the 2023 financial data.",
        timestamp: new Date(),
      }
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-4 py-3 shadow-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">FinSight AI</h1>
            <p className="text-xs text-slate-500 font-medium">Financial Analyst Agent</p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Reset Chat"
        >
          <RefreshCcw size={18} />
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, idx) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isLatest={idx === messages.length - 1} 
            />
          ))}
          
          {loadingState === LoadingState.LOADING && (
            <div className="flex justify-start mb-6 animate-pulse">
               <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none bg-white border-t border-slate-200 p-4 pb-6 z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Predefined Queries / Suggestion Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
             {PREDEFINED_QUERIES.map((query, idx) => (
               <button
                 key={idx}
                 onClick={() => handleSendMessage(query)}
                 disabled={loadingState === LoadingState.LOADING}
                 className="flex-shrink-0 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
               >
                 <Sparkles size={12} className="text-yellow-500" />
                 {query}
               </button>
             ))}
          </div>

          {/* Input Bar */}
          <div className="relative flex items-center shadow-lg rounded-2xl ring-1 ring-slate-900/5 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about revenue, net income, or trends..."
              disabled={loadingState === LoadingState.LOADING}
              className="w-full bg-white text-slate-800 placeholder:text-slate-400 px-4 py-3.5 rounded-2xl outline-none disabled:bg-slate-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || loadingState === LoadingState.LOADING}
              className="absolute right-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] text-slate-400">
              AI generated responses. Financial data is simulated for demonstration purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;