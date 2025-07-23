import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/ui/password-input';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
   const [message, setMessage] = useState('');


   const { signIn, signUp, user, resetPasswordForEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (user && params.get('flow') !== 'reset') {
      navigate('/');
    }

    const type = params.get('type');
    const accessToken = params.get('access_token');

    if (type === 'recovery' && accessToken) {
      setShowForgotPasswordModal(true);
    }
  }, [user, navigate]);

  const handleTabChange = () => {
    setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setError('');
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
          toast({
            title: 'Sign In Failed',
            description: 'Invalid email or password.',
            variant: 'destructive',
          });
      } 
      else {
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      // Do not clear email and password to preserve user input
      setUsername('');
      setConfirmPassword(''); // Clear confirm password after sign-in attempt
    }
  };





  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await resetPasswordForEmail(forgotPasswordEmail);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: 'Password Reset Initiated',
          description: 'If an account with that email exists, a password reset link has been sent to your inbox.',
          variant: 'default',
        });
        setShowForgotPasswordModal(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: 'Password Reset Successful',
          description: 'Your password has been updated. Please sign in with your new password.',
          variant: 'default',
        });
        setShowForgotPasswordModal(false);
        navigate('/auth'); // Redirect to sign-in page
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
// Remove this line since setEmailError is not defined and not needed

    if (password !== confirmPassword) {
      setError('Password did not match');
      setConfirmPassword(''); // Clear confirm password on mismatch
      setLoading(false);
      return;
    }

    if (password.includes(' ')) {
      setError('Password cannot contain spaces.');
      setLoading(false);
      return;
    }

    // Email validation
    const allowedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'org.in'];
    if (email.includes('+')) {
      setError('Email cannot contain + symbol.');
      toast({
        title: 'Invalid Email',
        description: 'Email cannot contain + symbol.',
        variant: 'destructive',
      });
      setLoading(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUsername('');
      return;
    }

    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    const domain = emailParts[1];
    if (!allowedDomains.includes(domain)) {
      setError('Please use a famous email domain (e.g., gmail.com, outlook.com, yahoo.com).');
      toast({
        title: 'Invalid Email Domain',
        description: 'Please use a famous email domain (e.g., gmail.com, outlook.com, yahoo.com).',
        variant: 'destructive',
      });
      setLoading(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUsername('');
      return;
    }
    
    try {
      const { error } = await signUp(email, password, username);
      if (error) {
        setError(error.message);
        setConfirmPassword(''); // Clear confirm password on error
        // Display toast only if the error is specifically for an existing user
        if (error.message === "This email is already registered. Please sign in or use a different email.") {
          toast({
            title: 'User Already Exist',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        // If no error, it means sign-up was successful (e.g., confirmation link sent)
        toast({
          title: 'Sign Up Successful',
          description: 'A confirmation link has been sent to your email address.',
          variant: 'default',
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
      setUsername('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-2">
      <div className="w-full max-w-md">
        <div className="text-center mb-2">
          <Link to="/" className="text-4xl font-bold text-primary">
            ToolHub
          </Link>
        </div>
        <Card>
          <CardHeader>
          <CardTitle className="text-center w-full text-2xl font-semibold">
          Welcome
           </CardTitle>

           <CardDescription className="text-center w-full text-base text-gray-600 mt-1">
            Sign in to your account or create a new one
            </CardDescription>

          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <PasswordInput
                      id="signin-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
          <div className="mt-4 text-center text-sm">
            <Link to="#" className="underline" onClick={() => setShowForgotPasswordModal(true)}>
              Forgot your password?
            </Link>
          </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>


              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Optional"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <PasswordInput
                      id="signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <PasswordInput
                      id="signup-confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert className="mt-4 border-destructive w-full">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-orange-500 font-bold text-3xl text-center w-full">
            Forgot Password
          </DialogTitle>

          <DialogDescription className="text-black text-center text-base w-full">
            Enter your email to receive a password reset link.
          </DialogDescription>

          <div className="bg-red-600 text-white p-2 rounded mt-2 w-fit mx-auto">
            Edit password in profile section.
          </div>
        </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-password-email">Email</Label>
              <Input
                id="forgot-password-email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;