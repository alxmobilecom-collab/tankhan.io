
export type Locale = 'RU' | 'EN';

export enum TestType {
  Energy = 'energy',
  Flexibility = 'flexibility',
  Food = 'food',
  Fitness = 'fitness',
  Social = 'social'
}

export interface Question {
  id: string;
  text: Record<Locale, string>;
  options: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  text: Record<Locale, string>;
  weight: number;
}

export interface Test {
  id: TestType;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  priceTokens: number;
  questions: Question[];
  calcMode: 'formula' | 'llm';
}

export interface User {
  id: string;
  email?: string;
  telegramId?: string;
  role: 'client' | 'agent' | 'admin';
  tokens: number;
  completedTests: TestType[];
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  location: string;
  specialties: TestType[];
  rating: number;
  telegramHandle: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'spend' | 'grant';
  timestamp: number;
}
