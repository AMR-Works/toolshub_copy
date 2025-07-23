import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { UsageIndicator } from '@/components/UsageIndicator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Code, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useToast } from '@/hooks/use-toast';

export const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const { usage, isPremium, canUseTool, trackToolUsage, getRemainingUses, monthlyLimit } = useUsageTracking();
  const { toast } = useToast();

  const formatJSON = () => {
    if (!canUseTool('json-formatter')) {
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
        description: "Please enter JSON to format.",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError('');
      
      trackToolUsage('json-formatter');
      
      toast({
        title: "JSON Formatted! ✨",
        description: "Your JSON has been formatted and validated.",
      });
    } catch (e: any) {
      setIsValid(false);
      setError(e.message);
      setOutput('');
      
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax.",
        variant: "destructive"
      });
    }
  };

  const minifyJSON = () => {
    if (!canUseTool('json-formatter')) {
      toast({
        title: "Usage Limit Reached",
        description: "Upgrade to Premium for unlimited access to all tools.",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError('');
      
      trackToolUsage('json-formatter');
      
      toast({
        title: "JSON Minified! 🗜️",
        description: "Your JSON has been minified.",
      });
    } catch (e: any) {
      setIsValid(false);
      setError(e.message);
      setOutput('');
    }
  };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast({
        title: "Copied! 📋",
        description: "Formatted JSON copied to clipboard.",
      });
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KPHN2Zz4=')] opacity-20"></div>
        
        <Navigation />
        
        <div className="relative py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Developer Tool</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  JSON
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Formatter
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Format, validate, and minify JSON data with syntax highlighting and error detection.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <UsageIndicator 
                usage={usage.toolsUsed} 
                limit={monthlyLimit} 
                isPremium={isPremium} 
              />

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Section */}
                  <div>
                    <Label className="text-white mb-3 block text-lg font-semibold">
                      Input JSON
                    </Label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='{"name": "John", "age": 30}'
                      className="bg-white/10 border-white/20 text-white font-mono text-sm h-64 resize-none"
                    />
                    
                    <div className="flex items-center space-x-3 mt-4">
                      <Button
                        onClick={formatJSON}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Format & Validate
                      </Button>
                      <Button
                        onClick={minifyJSON}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Minify
                      </Button>
                      <Button
                        onClick={clearAll}
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Output Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-white text-lg font-semibold">
                        Output
                      </Label>
                      <div className="flex items-center space-x-2">
                        {isValid === true && (
                          <div className="flex items-center text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Valid JSON
                          </div>
                        )}
                        {isValid === false && (
                          <div className="flex items-center text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Invalid JSON
                          </div>
                        )}
                        {output && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyOutput}
                            className="text-gray-400 hover:text-white p-2"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Textarea
                      value={output}
                      readOnly
                      className="bg-white/10 border-white/20 text-white font-mono text-sm h-64 resize-none"
                      placeholder="Formatted JSON will appear here..."
                    />
                    
                    {error && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 text-sm font-mono">{error}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* JSON Tips */}
                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <h3 className="text-blue-400 font-medium mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    JSON Tips
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Use double quotes for strings, not single quotes</li>
                    <li>• Property names must be in double quotes</li>
                    <li>• No trailing commas allowed</li>
                    <li>• Use null instead of undefined</li>
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