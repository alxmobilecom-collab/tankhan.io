
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_TESTS, REVIEWS, PACKAGE_PRICE } from '../constants';
import { Play, Star, ChevronRight, Zap, ShoppingBag, BrainCircuit, Sparkles } from 'lucide-react';
import TestRunner from './TestRunner';
import { Test } from '../types';
import { generateTestQuestions } from '../services/gemini';

interface LandingPageProps {
  onAuthRequired?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthRequired }) => {
  const { locale, tokens, spendTokens, addTokens, user } = useApp();
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartTest = async (testTemplate: Test) => {
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        alert(locale === 'RU' ? 'Сначала войдите в систему' : 'Please login first');
      }
      return;
    }

    if (tokens < testTemplate.priceTokens) {
      setShowPayModal(true);
      return;
    }

    try {
      setIsGenerating(true);
      const questions = await generateTestQuestions(
        testTemplate.id, 
        testTemplate.description[locale]
      );
      
      spendTokens(testTemplate.priceTokens);
      
      const readyTest = { ...testTemplate, questions };
      setActiveTest(readyTest);
    } catch (error) {
      alert(locale === 'RU' 
        ? 'Ошибка при генерации теста. Попробуйте еще раз.' 
        : 'Error generating test. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 space-y-24">
      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-purple-500/20 blur-[100px] animate-pulse rounded-full"></div>
            <div className="relative w-32 h-32 bg-purple-900/40 rounded-full flex items-center justify-center border border-purple-500/30">
              <BrainCircuit size={64} className="text-purple-400 animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2 animate-ping">
              <Sparkles size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 animate-pulse">
            {locale === 'RU' ? 'TANAKH AI создаёт ваш тест...' : 'TANAKH AI is crafting your test...'}
          </h2>
          <p className="opacity-60 max-w-sm">
            {locale === 'RU' 
              ? 'Мы генерируем уникальные вопросы, основанные на последних исследованиях в этой области.' 
              : 'Generating unique questions based on the latest research in this field.'}
          </p>
        </div>
      )}

      <section className="max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
          TANAKH ECOSYSTEM
        </div>

        <h1 className="text-5xl md:text-7xl font-manrope font-extrabold leading-tight">
          {locale === 'RU' ? 'Раскрой свой' : 'Unlock your'} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            {locale === 'RU' ? 'потенциал' : 'potential'}
          </span>
        </h1>
        <p className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto">
          {locale === 'RU' 
            ? 'Раскройте свой потенциал в 5 ключевых сферах жизни через персонализированные AI-тесты.' 
            : 'Unleash your potential in 5 key areas through personalized AI-driven tests.'}
        </p>
        
        <div className="relative group max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden glass-card shadow-2xl shadow-purple-900/40">
          <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200" alt="AI Preview" className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 bg-white text-purple-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
              <Play fill="currentColor" size={32} className="ml-1" />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-manrope font-bold">
              {locale === 'RU' ? 'AI-Тестирование' : 'AI-Testing'}
            </h2>
            <p className="opacity-60">
              {locale === 'RU' ? 'Каждый тест уникален и генерируется специально для вас.' : 'Every test is unique and generated specifically for you.'}
            </p>
          </div>
          <button 
            onClick={() => addTokens(PACKAGE_PRICE)}
            className="purple-gradient px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-purple-500/20 hover:-translate-y-1 transition-transform"
          >
            <ShoppingBag size={20} />
            {locale === 'RU' ? 'Пакет "Все включено" - 450 T' : 'All-Inclusive Package - 450 T'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_TESTS.map((test) => (
            <div key={test.id} className="glass-card p-8 rounded-3xl hover:border-purple-500/50 transition-all group relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -z-10 group-hover:bg-purple-600/30"></div>
              <div className="mb-4 inline-flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                AI Generated
              </div>
              <h3 className="text-2xl font-bold mb-2">{test.title[locale]}</h3>
              <p className="text-sm opacity-60 mb-8 flex-grow">{test.description[locale]}</p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 font-bold text-xl">
                  <Zap size={20} className="text-yellow-400" />
                  {test.priceTokens} T
                </div>
                <button 
                  onClick={() => handleStartTest(test)}
                  disabled={isGenerating}
                  className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold hover:bg-purple-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {locale === 'RU' ? 'Начать' : 'Start'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-manrope font-bold mb-12 text-center">
          {locale === 'RU' ? 'Отзывы сообщества' : 'Community Reviews'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map(review => (
            <div key={review.id} className="glass-card p-6 rounded-2xl relative">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "#fbbf24" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-600"} />
                ))}
              </div>
              <p className="italic opacity-80 mb-4">&ldquo;{review.text[locale]}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full purple-gradient flex items-center justify-center text-[10px] font-bold">
                  {review.name[0]}
                </div>
                <span className="font-bold">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showPayModal && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl space-y-6 text-center animate-in zoom-in">
            <div className="w-20 h-20 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-bold">
              {locale === 'RU' ? 'Недостаточно токенов' : 'Insufficient Tokens'}
            </h2>
            <p className="opacity-70">
              {locale === 'RU' 
                ? 'Для начала AI-теста необходимо пополнить баланс.' 
                : 'Please top up your balance to start the AI test.'}
            </p>
            <div className="grid gap-3">
              <button 
                onClick={() => { addTokens(100); setShowPayModal(false); }}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                100 T — 10.00$
              </button>
              <button 
                onClick={() => { addTokens(500); setShowPayModal(false); }}
                className="w-full purple-gradient py-4 rounded-xl font-bold hover:opacity-90 transition-opacity text-white"
              >
                500 T — 40.00$ (Save 20%)
              </button>
            </div>
            <button onClick={() => setShowPayModal(false)} className="text-sm opacity-50 hover:opacity-100">
              {locale === 'RU' ? 'Отмена' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {activeTest && (
        <TestRunner test={activeTest} onClose={() => setActiveTest(null)} />
      )}
    </div>
  );
};

export default LandingPage;


