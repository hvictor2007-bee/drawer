
import React, { useState, useCallback, useMemo } from 'react';
import Wheel from './components/Wheel';
import WinnerModal from './components/WinnerModal';
import { generateCongratsMessage } from './services/geminiService';
import { WinnerData } from './types';
import { APP_TITLE, APP_SUBTITLE } from './constants';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('王小明\n李華\n張偉\n陳志豪\n林雅婷\n周杰倫\n蔡依林\n五月天');
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWinner, setLastWinner] = useState<WinnerData | null>(null);
  const [history, setHistory] = useState<WinnerData[]>([]);

  const nameList = useMemo(() => {
    return inputText
      .split('\n')
      .map(n => n.trim())
      .filter(n => n !== '');
  }, [inputText]);

  const handleRemoveDuplicates = () => {
    const uniqueNames = Array.from(new Set(nameList));
    setInputText(uniqueNames.join('\n'));
  };

  const handleSpinStart = () => {
    if (nameList.length < 2) {
      alert('請至少輸入兩個名字來進行抽獎！');
      return;
    }
    if (isSpinning) return;
    setIsSpinning(true);
  };

  const handleSpinEnd = useCallback(async (winnerName: string) => {
    setIsSpinning(false);
    
    // Trigger confetti
    if ((window as any).confetti) {
      (window as any).confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Get AI congrats message
    const congrats = await generateCongratsMessage(winnerName);
    const winnerData: WinnerData = {
      name: winnerName,
      congratsMessage: congrats,
      timestamp: Date.now()
    };
    
    setLastWinner(winnerData);
    setHistory(prev => [winnerData, ...prev]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Sidebar: Settings and Names */}
      <aside className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-screen overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🎡</span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{APP_TITLE}</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{APP_SUBTITLE}</p>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
            <span>名單輸入 (一行一個)</span>
            <span className="text-xs font-normal text-slate-400">目前共 {nameList.length} 位</span>
          </label>
          <textarea
            className="flex-1 w-full p-4 text-sm border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none font-mono bg-slate-50"
            placeholder="請輸入名字，每行一位..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSpinning}
          />
          
          <button
            onClick={handleRemoveDuplicates}
            className="mt-4 w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            disabled={isSpinning}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清除重複項
          </button>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3">中獎歷史</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">尚無中獎紀錄</p>
            ) : (
              history.map((h, i) => (
                <div key={h.timestamp} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center animate-in slide-in-from-right-4 duration-300">
                  <span className="font-bold text-slate-700">{h.name}</span>
                  <span className="text-[10px] text-slate-400">{new Date(h.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content: The Wheel */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-indigo-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <div className="w-96 h-96 bg-indigo-400 rounded-full blur-[100px]"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-20 opacity-10 pointer-events-none">
          <div className="w-80 h-80 bg-rose-400 rounded-full blur-[80px]"></div>
        </div>

        <div className="z-10 flex flex-col items-center">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 drop-shadow-sm">
              幸運之輪，轉動希望！
            </h2>
            <p className="text-slate-500 font-medium">點擊下方按鈕開始抽獎，祝你好運</p>
          </div>

          <div className="relative mb-12 transform scale-75 md:scale-100 transition-transform">
             <Wheel names={nameList} isSpinning={isSpinning} onSpinEnd={handleSpinEnd} />
          </div>

          <button
            onClick={handleSpinStart}
            disabled={isSpinning || nameList.length < 2}
            className={`
              group relative px-12 py-5 rounded-2xl text-2xl font-black tracking-widest uppercase transition-all duration-300
              ${isSpinning || nameList.length < 2 
                ? 'bg-slate-300 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:translate-y-0 shadow-xl'
              }
            `}
          >
            {isSpinning ? '旋轉中...' : '立即抽獎'}
            {!isSpinning && nameList.length >= 2 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
              </span>
            )}
          </button>
        </div>
      </main>

      <WinnerModal winner={lastWinner} onClose={() => setLastWinner(null)} />
    </div>
  );
};

export default App;
