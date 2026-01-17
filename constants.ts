import { FinancialMetric } from './types';

// Mock Financial Data (The "Analyzed Data" from Task 1)
export const FINANCIAL_DATA: FinancialMetric[] = [
  { period: "Q1 2023", revenue: 1200000, netIncome: 150000, expenses: 1050000, profitMargin: 12.5 },
  { period: "Q2 2023", revenue: 1350000, netIncome: 210000, expenses: 1140000, profitMargin: 15.5 },
  { period: "Q3 2023", revenue: 1100000, netIncome: 90000, expenses: 1010000, profitMargin: 8.1 },
  { period: "Q4 2023", revenue: 1600000, netIncome: 320000, expenses: 1280000, profitMargin: 20.0 },
];

export const PREDEFINED_QUERIES = [
  "What is the total revenue for 2023?",
  "How has net income changed over the year?",
  "Show me the expense trend.",
  "Which quarter had the highest profit margin?",
];

export const SYSTEM_INSTRUCTION = `
You are FinSight, an expert financial analyst chatbot. 
You have access to the following quarterly financial data for the fiscal year 2023:
${JSON.stringify(FINANCIAL_DATA)}

Your goal is to answer user questions concisely based *only* on this data.
If the user asks about trends, comparisons, or specific metrics over time, you MUST recommend a visualization by setting 'showChart' to true in the JSON response.

Return your response in the following JSON format:
{
  "answer": "The text response to the user.",
  "showChart": boolean, // true if a chart would help visualize the answer
  "chartType": "bar" | "line" | "area", // best chart type for the data
  "chartTitle": "Title of the chart",
  "chartData": [ { "name": "Q1 2023", "value": 1200000 }, ... ] // The data points to plot. 'name' should be the period, 'value' the metric.
}
`;