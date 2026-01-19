
import React from 'react';
import { WinnerData } from '../types';

interface WinnerModalProps {
  winner: WinnerData | null;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
        <div className="h-32 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 flex items-center justify-center">
          <div className="text-6xl">🏆</div>
        </div>
        
        <div className="p-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">恭喜獲獎！</h2>
          <div className="text-5xl font-black text-rose-600 my-6 drop-shadow-sm">
            {winner.name}
          </div>
          <p className="text-lg text-slate-600 italic leading-relaxed px-4">
            "{winner.congratsMessage}"
          </p>
          
          <button
            onClick={onClose}
            className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg"
          >
            太棒了！關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
