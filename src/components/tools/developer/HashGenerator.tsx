import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { UsageIndicator } from '@/components/UsageIndicator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Copy } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useToast } from '@/hooks/use-toast';
import CryptoJS from 'crypto-js';

export const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA256');
  const [result, setResult] = useState('');
  const { usage, isPremium, canUseTool, trackToolUsage, getRemainingUses, monthlyLimit } = useUsageTracking();
  const { toast } = useToast();

  const generateHash = () => {
    if (!canUseTool('hash-generator')) {
      toast({
        title: "Usage Limit Reached",
        description: "Upgrade to Premium for unlimited access to all tools.",
        variant: "destructive"
      });
      return;
    }

    if (!input.trim()) {
      toast({
        title: "No Input",
        description: "Please enter text to generate hash.",
        variant: "destructive"
      });
      return;
    }

    let hash = '';
    
    try {
      switch (algorithm) {
        case 'MD5':
          hash = CryptoJS.MD5(input).toString();
          break;
        case 'SHA1':
          hash = CryptoJS.SHA1(input).toString();
          break;
        case 'SHA256':
          hash = CryptoJS.SHA256(input).toString();
          break;
        case 'SHA512':
          hash = CryptoJS.SHA512(input).toString();
          break;
        default:
          hash = CryptoJS.SHA256(input).toString();
      }
      
      setResult(hash);
      trackToolUsage('hash-generator');
      
      toast({
        title: "Hash Generated! 🔐",
        description: `${algorithm} hash created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hash.",
        variant: "destructive"
      });
    }
  };

  const copyHash = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: "Copied! 📋",
        description: "Hash copied to clipboard.",
      });
    }
  };

  const algorithms = [
    { value: 'MD5', label: 'MD5 (128-bit)' },
    { value: 'SHA1', label: 'SHA-1 (160-bit)' },
    { value: 'SHA256', label: 'SHA-256 (256-bit)' },
    { value: 'SHA512', label: 'SHA-512 (512-bit)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KPHN2Zz4=')] opacity-20"></div>
        
        <Navigation />
        
        <div className="relative py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Developer Tool</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Hash
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Generator
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Generate cryptographic hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <UsageIndicator 
                usage={usage.toolsUsed} 
                limit={monthlyLimit} 
                isPremium={isPremium} 
              />

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                {/* Input Section */}
                <div className="mb-6">
                  <Label className="text-white mb-3 block text-lg font-semibold">
                    Input Text
                  </Label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to generate hash..."
                    className="bg-white/10 border-white/20 text-white h-32 resize-none"
                  />
                </div>

                {/* Algorithm Selection */}
                <div className="mb-6">
                  <Label className="text-white mb-3 block">Hash Algorithm</Label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map((algo) => (
                        <SelectItem key={algo.value} value={algo.value}>
                          {algo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateHash}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg mb-6"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Generate Hash
                </Button>

                {/* Result Section */}
                {result && (
                  <div className="bg-white/10 border-white/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-white font-semibold">
                        {algorithm} Hash
                      </Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyHash}
                        className="text-gray-400 hover:text-white p-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Input
                      value={result}
                      readOnly
                      className="bg-white/5 border-white/10 text-white font-mono text-sm"
                    />
                    
                    <div className="mt-3 text-gray-400 text-sm">
                      Length: {result.length} characters
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <h3 className="text-amber-400 font-medium mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Note
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• MD5 and SHA-1 are cryptographically broken, use for checksums only</li>
                    <li>• SHA-256 and SHA-512 are currently secure for most applications</li>
                    <li>• Hashes are one-way functions - original text cannot be recovered</li>
                    <li>• Same input will always produce the same hash output</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};