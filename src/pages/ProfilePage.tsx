import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Crown, User, Mail, Calendar, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { profile, signOut, updateProfile, updatePassword } = useAuth();
  const { isPremium } = usePremium();
  const [username, setUsername] = useState(profile?.username || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for successful payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast.success('Payment successful! Welcome to Premium!');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (!profile && !loading) {
      navigate('/auth');
    }
  }, [profile, loading, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await updateProfile({ username });
    if (error) {
      setMessage('Error updating profile');
    } else {
      setMessage('Profile updated successfully!');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      setPasswordLoading(false);
      return;
    }

    const { error } = await updatePassword(newPassword);
    if (error) {
      setPasswordMessage('Cannot have your previous password as new password');
    } else {
      setPasswordMessage('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    }
    setPasswordLoading(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p>Loading profile or redirecting...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings
            </p>
          </div>

          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 ">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isPremium 
                      ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300' 
                      : 'bg-primary/10'
                  }`}>
                    {isPremium ? (
                      <Crown className="h-8 w-8 text-yellow-600" />
                    ) : (
                      <User className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        {profile.username || 'User'}
                      </h3>
                      {isPremium && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium Member
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {profile.email}
                    </p>
                  </div>
                </div>
                <Button variant="destructive" onClick={signOut} className="self-start">
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {isPremium ? 'Premium Account' : 'Free Account'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isPremium 
                      ? `Expires: ${formatDate(profile.premium_expires_at)}`
                      : 'Upgrade to unlock premium features'
                    }
                  </p>
                </div>
                <Badge variant={isPremium ? "default" : "secondary"}>
                  {isPremium ? 'Active' : 'Free'}
                </Badge>
              </div>

              {!isPremium && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Upgrade to Premium</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get unlimited access to all tools and features
                  </p>
                  <Link to="/pricing">
                    <Button variant="default" size="sm">
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              )}

              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Member since {formatDate(profile.created_at)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-6 ">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2 mt-4 ">
                  <Label className="text-2xl" htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  Update Profile
                </Button>
                {message && (
                  <p className="text-sm text-green-600">{message}</p>
                )}
              </form>
            </CardContent>
          </Card>
          {/* Password Change Card */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative mb-2">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" disabled={passwordLoading}>
                  Change Password
                </Button>
                {passwordMessage && (
                  <p className={`text-sm ${passwordMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{passwordMessage}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;