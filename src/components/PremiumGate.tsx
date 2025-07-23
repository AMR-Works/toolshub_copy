import React from 'react';
import { usePremium } from '@/hooks/usePremium';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ feature, children }) => {
  const { isPremium, checkPremiumAccess } = usePremium();
  
  const access = checkPremiumAccess(feature);
  
  if (access.hasAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50/50">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-yellow-600" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-yellow-800">
          <Crown className="h-5 w-5" />
          Premium Feature
        </CardTitle>
        <CardDescription className="text-yellow-700">
          {access.message}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link to="/premium">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
            Upgrade to Premium
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};