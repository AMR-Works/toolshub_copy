import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UsageIndicatorProps {
  usage: number;
  limit: number;
  isPremium: boolean;
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({ 
  usage, 
  limit, 
  isPremium 
}) => {
  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Crown className="w-5 h-5 text-yellow-400" />
          <div className="flex-1">
            <p className="text-yellow-400 font-medium">Premium Plan</p>
            <p className="text-gray-300 text-sm">Unlimited tool usage</p>
          </div>
        </div>
      </div>
    );
  }

  const percentage = (usage / limit) * 100;
  const remaining = limit - usage;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">Monthly Usage</span>
        </div>
        <span className="text-gray-300 text-sm">
          {usage} / {limit} tools used
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className="mb-3"
      />
      
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          {remaining > 0 ? `${remaining} uses remaining` : 'Limit reached'}
        </p>
        
        {remaining <= 3 && (
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Upgrade to Pro
          </Button>
        )}
      </div>
      
      {remaining === 0 && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">
            You've reached your monthly limit. Upgrade to Premium for unlimited access.
          </p>
        </div>
      )}
    </div>
  );
};