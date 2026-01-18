
import { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeFoodImage } from '../services/gemini';
import { Camera, RefreshCw, Zap, Flame, Info, ChevronLeft, BrainCircuit, User } from 'lucide-react';

interface FoodResult {
  itemName: string;
  calories: number;
  macros: {
    proteins: number;
    fats: number;
    carbs: number;
  };
  healthTip: string;
}

const FoodScanner: React.FC = () => {
  const { locale, tokens, spendTokens, user } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError(locale === 'RU' ? 'Доступ к камере отклонен' : 'Camera access denied');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    if (tokens < 5) {
      setError(locale === 'RU' ? 'Недостаточно токенов (нужно 5 T)' : 'Insufficient tokens (5 T required)');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    // Capture frame
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
      
      try {
        // Extract physical profile for AI personalization
        const physicalProfile = user ? {
          weight: user.weight,
          height: user.height,
          age: user.age,
          gender: user.gender
        } : undefined;

        const analysis = await analyzeFoodImage(base64Image, locale, physicalProfile);
        spendTokens(5);
        setResult(analysis);
        stopCamera();
      } catch (err) {
        setError(locale === 'RU' ? 'Ошибка анализа. Попробуйте снова.' : 'Analysis error. Try again.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const hasProfileData = user && (user.weight || user.height || user.age || user.gender);

  return (
    <div className="pt-32 pb-24 px-4 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-manrope font-extrabold flex items-center justify-center gap-3">
          <BrainCircuit className="text-purple-400" />
          {locale === 'RU' ? 'AI Сканер Еды' : 'AI Food Scanner'}
        </h2>
        <p className="opacity-60 text-sm">
          {locale === 'RU' 
            ? 'Наведите камеру на блюдо, чтобы узнать КБЖУ' 
            : 'Point your camera at food to see nutritional info'}
        </p>
      </div>

      {!isCameraActive && !result ? (
        <div className="glass-card aspect-square rounded-[2.5rem] flex flex-col items-center justify-center border-dashed border-white/20 p-8 space-y-6">
          <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Camera size={48} className="text-purple-400" />
          </div>
          <button 
            onClick={startCamera}
            className="purple-gradient px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {locale === 'RU' ? 'Запустить камеру' : 'Start Camera'}
          </button>
          <div className="text-xs opacity-40 flex items-center gap-1">
             <Zap size={12} className="text-yellow-400" />
             {locale === 'RU' ? 'Стоимость: 5 T' : 'Cost: 5 T'}
          </div>
          {hasProfileData && (
            <div className="text-[10px] uppercase font-bold text-purple-400/60 bg-purple-500/5 px-3 py-1 rounded-full border border-purple-500/10">
              {locale === 'RU' ? 'Персонализация включена' : 'Personalization active'}
            </div>
          )}
        </div>
      ) : isCameraActive && !isAnalyzing ? (
        <div className="relative glass-card aspect-square rounded-[2.5rem] overflow-hidden border-2 border-purple-500/30">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-[2px] border-white/20 m-12 rounded-3xl pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-lg"></div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
             <button 
                onClick={handleScan}
                className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-4 border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
             >
                <div className="w-16 h-16 bg-white rounded-full"></div>
             </button>
             <button onClick={stopCamera} className="text-xs font-bold opacity-60 hover:opacity-100 bg-black/40 px-3 py-1 rounded-full">{locale === 'RU' ? 'Отмена' : 'Cancel'}</button>
          </div>
        </div>
      ) : isAnalyzing ? (
        <div className="glass-card aspect-square rounded-[2.5rem] flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center">
              <BrainCircuit size={32} className="text-purple-400 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold animate-pulse">{locale === 'RU' ? 'Анализируем...' : 'Analyzing...'}</h3>
            <p className="text-sm opacity-50">
              {hasProfileData 
                ? (locale === 'RU' ? 'Учитываем ваш профиль...' : 'Customizing for your profile...') 
                : (locale === 'RU' ? 'ИИ определяет состав блюда' : 'AI is identifying ingredients')}
            </p>
          </div>
        </div>
      ) : null}

      {result && (
        <div className="glass-card p-8 rounded-[2.5rem] space-y-8 animate-in zoom-in duration-500">
           <div className="flex justify-between items-start">
             <div>
               <h3 className="text-2xl font-bold text-purple-400">{result.itemName}</h3>
               <div className="flex items-center gap-2 text-3xl font-black mt-2">
                 <Flame className="text-orange-500" />
                 {result.calories} <span className="text-sm font-normal opacity-50 uppercase tracking-widest ml-1">kcal</span>
               </div>
             </div>
             <button 
                onClick={startCamera}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
             >
                <RefreshCw size={20} />
             </button>
           </div>

           <div className="grid grid-cols-3 gap-4">
              {[
                { label: locale === 'RU' ? 'Белки' : 'Prot', val: result.macros.proteins, color: 'bg-blue-500', max: 50 },
                { label: locale === 'RU' ? 'Жиры' : 'Fats', val: result.macros.fats, color: 'bg-yellow-500', max: 40 },
                { label: locale === 'RU' ? 'Углев' : 'Carbs', val: result.macros.carbs, color: 'bg-green-500', max: 100 },
              ].map((macro, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <span>{macro.label}</span>
                    <span>{macro.val}g</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${macro.color} transition-all duration-1000`} 
                      style={{ width: `${Math.min((macro.val / macro.max) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
           </div>

           <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex flex-col gap-2 relative">
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400/80 mb-1">
               <User size={12} />
               {hasProfileData ? (locale === 'RU' ? 'Персональный совет' : 'Personal Tip') : (locale === 'RU' ? 'Совет от AI' : 'AI Tip')}
             </div>
             <div className="flex gap-4 items-start">
               <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 shrink-0">
                 <Info size={18} />
               </div>
               <p className="text-sm opacity-80 leading-relaxed italic">
                 &ldquo;{result.healthTip}&rdquo;
               </p>
             </div>
           </div>
           
           <button 
             onClick={() => setResult(null)} 
             className="w-full py-4 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest"
           >
             {locale === 'RU' ? 'Закрыть и очистить' : 'Clear and Close'}
           </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center font-bold">
          {error}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FoodScanner;
