import { useAuth } from '@/contexts/AuthContext';

export const usePremium = () => {
  const { profile } = useAuth();
  
  const isPremium = profile?.is_premium && 
    (!profile?.premium_expires_at || new Date(profile.premium_expires_at) > new Date());
  
  const checkPremiumAccess = (feature: string) => {
    if (!isPremium) {
      return {
        hasAccess: false,
        message: `This ${feature} feature is only available for premium users. Upgrade to unlock!`
      };
    }
    return { hasAccess: true, message: '' };
  };
  
  return {
    isPremium: !!isPremium,
    profile,
    checkPremiumAccess
  };
};