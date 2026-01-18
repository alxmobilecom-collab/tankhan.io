
import React, { useState, useEffect } from 'react';
import { Test, Question, AnswerOption, TestType } from '../types';
import { useApp } from '../context/AppContext';
import { ChevronLeft, CheckCircle, ExternalLink, Zap } from 'lucide-react';
import { generateTestAnalysis } from '../services/gemini';

interface TestRunnerProps {
  test: Test;
  onClose: () => void;
}

const LotusVisualization: React.FC<{ percentage: number }> = ({ percentage }) => {
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayPercent(percentage), 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Determine aura color based on percentage
  const getEnergyColor = (p: number) => {
    if (p < 30) return 'rgba(239, 68, 68, 0.3)'; // Red
    if (p < 70) return 'rgba(234, 179, 8, 0.3)'; // Yellow
    return 'rgba(34, 197, 94, 0.3)'; // Green
  };

  const getTextColor = (p: number) => {
    if (p < 30) return 'text-red-400';
    if (p < 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="relative w-64 h-64 mx-auto mb-8 flex flex-col items-center justify-center">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 blur-[60px] rounded-full transition-all duration-[2000ms] ease-out"
        style={{ 
          backgroundColor: getEnergyColor(displayPercent),
          opacity: Math.max(0.2, displayPercent / 100) 
        }}
      ></div>

      {/* The Silhouette SVG */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            {/* Dynamic Energy Gradient: Red -> Yellow -> Green */}
            <linearGradient id="energyGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ef4444" />   {/* Red */}
              <stop offset="50%" stopColor="#eab308" />  {/* Yellow */}
              <stop offset="100%" stopColor="#22c55e" /> {/* Green */}
            </linearGradient>
            
            <mask id="lotusMask">
              <path 
                fill="white" 
                d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 5c-2.2 0-4 1.8-4 4v3.5l-2.5 1.5c-.6.4-.8 1.1-.6 1.7.3.9 1.2 1.4 2.1 1.1l2.5-1.5V20c0 1.1.9 2 2 2s2-.9 2-2v-2.7l2.5 1.5c.9.3 1.8-.2 2.1-1.1.2-.6 0-1.3-.6-1.7l-2.5-1.5V11c0-2.2-1.8-4-4-4zm-5.5 8c-.8 0-1.5.7-1.5 1.5S5.7 18 6.5 18s1.5-.7 1.5-1.5S7.3 15 6.5 15zm11 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" 
              />
            </mask>
          </defs>
          
          {/* Static Outline */}
          <path 
            d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 5c-2.2 0-4 1.8-4 4v3.5l-2.5 1.5c-.6.4-.8 1.1-.6 1.7.3.9 1.2 1.4 2.1 1.1l2.5-1.5V20c0 1.1.9 2 2 2s2-.9 2-2v-2.7l2.5 1.5c.9.3 1.8-.2 2.1-1.1.2-.6 0-1.3-.6-1.7l-2.5-1.5V11c0-2.2-1.8-4-4-4zm-5.5 8c-.8 0-1.5.7-1.5 1.5S5.7 18 6.5 18s1.5-.7 1.5-1.5S7.3 15 6.5 15zm11 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="0.3"
          />

          {/* Filling Part */}
          <g mask="url(#lotusMask)">
            <rect 
              x="0" 
              y={24 - (24 * displayPercent / 100)} 
              width="24" 
              height="24" 
              fill="url(#energyGradient)"
              className="transition-all duration-[2000ms] ease-out"
            />
            {/* Animated Wave Top */}
            <rect 
              x="0" 
              y={24 - (24 * displayPercent / 100)} 
              width="24" 
              height="1.5" 
              fill="white"
              fillOpacity="0.4"
              className="animate-pulse"
            />
          </g>
        </svg>

        {/* Floating Percentage Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-4xl font-manrope font-black transition-colors duration-[2000ms] ${getTextColor(displayPercent)} drop-shadow-md`}>
            {Math.round(displayPercent)}%
          </span>
          <span className="text-[8px] uppercase font-bold tracking-[0.2em] opacity-40">Energy Level</span>
        </div>
      </div>
    </div>
  );
};

const TestRunner: React.FC<TestRunnerProps> = ({ test, onClose }) => {
  const { locale, spendTokens, tokens } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [finalScorePercent, setFinalScorePercent] = useState(0);

  const currentQuestion = test.questions[currentStep];
  const progress = ((currentStep + 1) / test.questions.length) * 100;

  const handleSelect = (option: AnswerOption) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
    if (currentStep < test.questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    }
  };

  const finishTest = async () => {
    setIsAnalyzing(true);
    setIsFinished(true);

    const score = Object.values(answers).reduce((acc, curr) => acc + curr.weight, 0);
    const maxScore = test.questions.length * 10;
    const percentage = (score / maxScore) * 100;
    setFinalScorePercent(percentage);

    if (test.calcMode === 'llm') {
      const result = await generateTestAnalysis(test.id, Object.values(answers), locale);
      setReport(result);
    } else {
      // Formula-based
      setReport(locale === 'RU' 
        ? `### Результат вашего теста\nВы набрали ${score} баллов из ${maxScore} (${Math.round(percentage)}%).\n\nВы отлично справляетесь! Чтобы получить подробную консультацию, обратитесь к нашему агенту.`
        : `### Your Test Result\nYou scored ${score} out of ${maxScore} (${Math.round(percentage)}%).\n\nYou are doing great! For a detailed consultation, please contact our agent.`
      );
    }
    setIsAnalyzing(false);
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full glass-card p-8 rounded-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-500" size={32} />
            {locale === 'RU' ? 'Тест завершен' : 'Test Completed'}
          </h2>
          
          {isAnalyzing ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="animate-pulse">{locale === 'RU' ? 'ИИ анализирует ваши ответы...' : 'AI is analyzing your answers...'}</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              
              {/* Specialized Visualization for Energy Test */}
              {test.id === TestType.Energy && (
                <LotusVisualization percentage={finalScorePercent} />
              )}

              <div dangerouslySetInnerHTML={{ __html: report?.replace(/\n/g, '<br/>') || '' }} />
              
              <div className="mt-8 p-6 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <h3 className="text-xl font-bold mb-2">🎁 {locale === 'RU' ? 'Подарок за прохождение' : 'Completion Bonus'}</h3>
                <p className="mb-4 text-sm opacity-90">
                  {locale === 'RU' 
                    ? 'Присоединяйтесь к нашему закрытому Telegram-каналу, чтобы получать эксклюзивные советы и инсайды.' 
                    : 'Join our private Telegram channel to receive exclusive tips and insights.'}
                </p>
                <a 
                  href="https://t.me/example_channel" 
                  target="_blank" 
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full font-bold transition-all"
                >
                  <ExternalLink size={18} />
                  {locale === 'RU' ? 'Вступить в канал' : 'Join Channel'}
                </a>
              </div>

              <button 
                onClick={onClose}
                className="mt-6 text-purple-400 hover:underline w-full py-4 rounded-xl hover:bg-white/5 transition-all font-bold"
              >
                {locale === 'RU' ? 'Вернуться на главную' : 'Back to Home'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] tanakh-gradient flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-white/10">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="font-bold text-base">{test.title[locale]}</h1>
          <p className="text-[10px] opacity-60 uppercase tracking-widest">
            {locale === 'RU' ? `Вопрос ${currentStep + 1} из ${test.questions.length}` : `Question ${currentStep + 1} of ${test.questions.length}`}
          </p>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="w-full h-1 bg-white/5">
        <div 
          className="h-full purple-gradient transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 overflow-y-auto">
        <div className="max-w-2xl w-full">
          <h2 className="text-lg md:text-2xl font-manrope font-bold mb-8 text-center leading-snug">
            {currentQuestion.text[locale]}
          </h2>

          <div className="flex flex-col gap-3 max-w-md mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-6 py-3.5 rounded-2xl border text-sm md:text-base transition-all duration-300 text-left flex items-center gap-4
                  ${answers[currentQuestion.id]?.id === option.id 
                    ? 'bg-blue-600 border-blue-400 ring-2 ring-blue-500/30 font-bold' 
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}
                `}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[currentQuestion.id]?.id === option.id ? 'border-white bg-white' : 'border-white/30'}`}>
                   {answers[currentQuestion.id]?.id === option.id && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                </div>
                {option.text[locale]}
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="p-6 border-t border-white/10 flex justify-center gap-4">
        {currentStep === test.questions.length - 1 && answers[currentQuestion.id] && (
          <button
            onClick={finishTest}
            className="purple-gradient px-10 py-3 rounded-full font-bold text-lg shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
          >
            {locale === 'RU' ? 'Завершить тест' : 'Finish Test'}
          </button>
        )}
      </footer>
    </div>
  );
};

export default TestRunner;
