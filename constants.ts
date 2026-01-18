
import { Test, TestType } from './types';

export const INITIAL_TOKENS = 0;
export const PACKAGE_PRICE = 450; 

export const ALL_TESTS: Test[] = [
  {
    id: TestType.Energy,
    title: { RU: 'Энергия', EN: 'Energy' },
    description: { RU: 'Узнайте уровень вашего жизненного тонуса', EN: 'Discover your vital energy level' },
    priceTokens: 100,
    questions: [],
    calcMode: 'llm'
  },
  {
    id: TestType.Flexibility,
    title: { RU: 'Гибкость', EN: 'Flexibility' },
    description: { RU: 'Оценка адаптивности и гибкости ума', EN: 'Assessment of adaptability and mental flexibility' },
    priceTokens: 100,
    questions: [],
    calcMode: 'formula'
  },
  {
    id: TestType.Food,
    title: { RU: 'Фуд (Еда)', EN: 'Food' },
    description: { RU: 'Анализ ваших пищевых привычек', EN: 'Analysis of your eating habits' },
    priceTokens: 120,
    questions: [],
    calcMode: 'llm'
  },
  {
    id: TestType.Fitness,
    title: { RU: 'Фитнес', EN: 'Fitness' },
    description: { RU: 'Ваша физическая форма и потенциал', EN: 'Your physical form and potential' },
    priceTokens: 100,
    questions: [],
    calcMode: 'formula'
  },
  {
    id: TestType.Social,
    title: { RU: 'Соцсети', EN: 'Social Media' },
    description: { RU: 'Влияние цифровой среды на вашу жизнь', EN: 'Impact of the digital environment on your life' },
    priceTokens: 80,
    questions: [],
    calcMode: 'llm'
  }
];

export const REVIEWS = [
  { id: '1', name: 'Alex', text: { RU: 'Очень точный результат!', EN: 'Very accurate results!' }, rating: 5 },
  { id: '2', name: 'Maria', text: { RU: 'Помогло разобраться в себе.', EN: 'Helped me understand myself.' }, rating: 5 },
  { id: '3', name: 'John', text: { RU: 'Рекомендую всем!', EN: 'Highly recommend!' }, rating: 4 }
];
