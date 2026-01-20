
import React, { useState, useCallback, useEffect } from 'react';
import { calculateCompatibility } from './utils/compatibilityLogic';
import { getLoveAdvice } from './services/geminiService';
import HeartRain from './components/HeartRain';
import { CompatibilityResult } from './types';

const App: React.FC = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const handleTest = useCallback(async () => {
    if (!name1 || !name2) {
      alert('두 사람의 이름을 모두 입력해주삼! s(￣▽￣)v');
      return;
    }

    setLoading(true);
    setAdvice('');
    setShowHearts(false);
    
    const res = calculateCompatibility(name1, name2);
    setResult(res);

    // Get AI Advice
    const loveAdvice = await getLoveAdvice(name1, name2, res.finalScore);
    setAdvice(loveAdvice);
    setLoading(false);

    if (res.finalScore >= 80) {
      setShowHearts(true);
    }
  }, [name1, name2]);

  const reset = () => {
    setResult(null);
    setAdvice('');
    setShowHearts(false);
    setName1('');
    setName2('');
  };

  return (
    <div className="min-h-screen cy-bg flex items-center justify-center p-4">
      {showHearts && <HeartRain />}

      {/* Main Mini-homepage Frame */}
      <div className="w-full max-w-2xl bg-white pixel-border relative p-2 md:p-6 overflow-hidden">
        {/* Top Header */}
        <div className="orange-header text-white px-4 py-2 flex justify-between items-center mb-6">
          <span className="text-sm md:text-base">♥ ${name1 || '나'}랑 ${name2 || '너'}랑 이름궁합 ♥</span>
          <div className="flex gap-2">
            <span className="cursor-pointer hover:underline text-xs">일촌맺기</span>
            <span className="cursor-pointer hover:underline text-xs">방명록</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="border-2 border-dashed border-[#ff6600] p-4 bg-[#fff9f0] min-h-[400px]">
          {!result ? (
            <div className="flex flex-col items-center justify-center space-y-8 mt-10">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl text-[#ff6600] mb-2">♥ 사랑의 이름 궁합 ♥</h1>
                <p className="text-gray-500 text-sm">노트에 끄적거리던 그 추억 그대로...☆</p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full max-w-md">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 pixel-border overflow-hidden mb-2">
                    <img src={`https://picsum.photos/seed/${name1 || 'user1'}/200`} alt="avatar1" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="당신의 이름"
                    className="w-full px-2 py-1 text-center pixel-border focus:outline-none"
                    maxLength={5}
                  />
                </div>

                <div className="text-4xl text-[#ff6600] font-bold">+</div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 pixel-border overflow-hidden mb-2">
                    <img src={`https://picsum.photos/seed/${name2 || 'user2'}/200`} alt="avatar2" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="그의 이름"
                    className="w-full px-2 py-1 text-center pixel-border focus:outline-none"
                    maxLength={5}
                  />
                </div>
              </div>

              <button
                onClick={handleTest}
                className="bg-[#ff6600] text-white px-8 py-3 text-xl pixel-border hover:brightness-110 active:scale-95 transition-all"
              >
                궁합 확인하긔!
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex justify-between w-full mb-4">
                 <button onClick={reset} className="text-xs text-blue-500 underline">← 다시하기</button>
                 <span className="text-sm text-gray-400">TODAY <span className="text-red-500">486</span> | TOTAL 123456</span>
              </div>

              <div className="w-full bg-white p-4 pixel-border mb-6">
                <h2 className="text-center text-lg mb-4 text-blue-600 border-b border-gray-200 pb-2">
                  {result.names[0]} ♥ {result.names[1]} 의 운명은?!
                </h2>

                <div className="flex flex-col items-center space-y-1 font-mono text-lg overflow-x-auto w-full pb-4">
                  {result.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 justify-center min-w-max">
                      {step.map((num, nIdx) => (
                        <span key={nIdx} className={`w-8 text-center ${idx === result.steps.length - 1 ? 'text-red-500 font-bold scale-125' : 'text-gray-700'}`}>
                          {num}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-1">최종 궁합 확률</div>
                <div className="text-5xl md:text-7xl text-red-500 font-bold animate-bounce">
                  {result.finalScore}%
                </div>
              </div>

              {loading ? (
                <div className="text-gray-500 italic animate-pulse">점괘를 해석중이삼... 기둘!</div>
              ) : (
                <div className="bg-[#e6f2ff] p-4 pixel-border w-full relative">
                  <div className="absolute -top-3 left-4 bg-blue-500 text-white px-2 text-xs">AI 도토리 도사</div>
                  <p className="text-blue-800 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                    {advice}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Side Menu Emulation */}
        <div className="hidden lg:flex flex-col absolute -right-12 top-10 gap-2">
          {['Home', 'Profile', 'Diary', 'Photo', 'Board', 'Guest'].map((menu) => (
            <div key={menu} className="bg-[#a3d5ff] pixel-border px-2 py-1 text-xs w-16 text-center text-white cursor-pointer hover:bg-blue-400">
              {menu}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2 items-center bg-white px-3 py-1 pixel-border">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        <span className="text-xs">BGM: 프리스타일 - Y (Please Tell Me Why)</span>
      </div>
    </div>
  );
};

export default App;
