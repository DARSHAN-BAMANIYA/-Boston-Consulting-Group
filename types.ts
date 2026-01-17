export interface FinancialMetric {
  period: string;
  revenue: number;
  netIncome: number;
  expenses: number;
  profitMargin: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
}

export interface AIResponseSchema {
  answer: string;
  showChart: boolean;
  chartType?: 'bar' | 'line' | 'area';
  chartTitle?: string;
  chartData?: ChartDataPoint[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chartData?: AIResponseSchema['chartData'];
  chartType?: AIResponseSchema['chartType'];
  chartTitle?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}