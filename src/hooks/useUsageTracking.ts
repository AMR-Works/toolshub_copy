import { useState, useEffect } from 'react';

export interface UsageData {
  month: string;
  toolsUsed: number;
  lastUsed: string;
  usedTools: string[];
}

const MONTHLY_FREE_LIMIT = 10;

export const useUsageTracking = () => {
  const [usage, setUsage] = useState<UsageData>({
    month: '',
    toolsUsed: 0,
    lastUsed: '',
    usedTools: []
  });
  const [isPremium] = useState(false); // Will be connected to auth later

  useEffect(() => {
    loadUsageData();
  }, []);

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const loadUsageData = () => {
    const currentMonth = getCurrentMonth();
    const stored = localStorage.getItem('toolhub_usage');
    
    if (stored) {
      const data = JSON.parse(stored);
      if (data.month === currentMonth) {
        setUsage(data);
        return;
      }
    }
    
    // Reset for new month
    const newData: UsageData = {
      month: currentMonth,
      toolsUsed: 0,
      lastUsed: '',
      usedTools: []
    };
    setUsage(newData);
    localStorage.setItem('toolhub_usage', JSON.stringify(newData));
  };

  const trackToolUsage = (toolName: string) => {
    if (isPremium) return true; // Unlimited for premium
    
    const currentMonth = getCurrentMonth();
    const updatedUsage = {
      ...usage,
      month: currentMonth,
      toolsUsed: usage.toolsUsed + 1,
      lastUsed: new Date().toISOString(),
      usedTools: [...new Set([...usage.usedTools, toolName])]
    };
    
    setUsage(updatedUsage);
    localStorage.setItem('toolhub_usage', JSON.stringify(updatedUsage));
    return true;
  };

  const canUseTool = (toolName: string): boolean => {
    if (isPremium) return true;
    return usage.toolsUsed < MONTHLY_FREE_LIMIT;
  };

  const getRemainingUses = (): number => {
    if (isPremium) return Infinity;
    return Math.max(0, MONTHLY_FREE_LIMIT - usage.toolsUsed);
  };

  return {
    usage,
    isPremium,
    canUseTool,
    trackToolUsage,
    getRemainingUses,
    monthlyLimit: MONTHLY_FREE_LIMIT
  };
};