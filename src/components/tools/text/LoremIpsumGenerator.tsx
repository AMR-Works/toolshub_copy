import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { UsageIndicator } from '@/components/UsageIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Copy, RefreshCw } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useToast } from '@/hooks/use-toast';

export const LoremIpsumGenerator = () => {
  const [count, setCount] = useState('5');
  const [type, setType] = useState('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [result, setResult] = useState('');
  const { usage, isPremium, canUseTool, trackToolUsage, getRemainingUses, monthlyLimit } = useUsageTracking();
  const { toast } = useToast();

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
    'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos',
    'dolores', 'quas', 'molestias', 'excepturi', 'occaecati', 'cupiditate',
    'similique', 'expedita', 'distinctio', 'nam', 'libero', 'tempore', 'cum',
    'soluta', 'nobis', 'eleifend', 'option', 'congue', 'nihil', 'imperdiet',
    'doming', 'placerat', 'facer', 'possim', 'assum', 'typi', 'non', 'habent',
    'claritatem', 'insitam', 'processus', 'dynamicus', 'sequitur', 'mutationem',
    'consuetudium', 'lectorum', 'mirum', 'notare', 'quam', 'littera', 'gothica'
  ];

  const generateLorem = () => {
    if (!canUseTool('lorem-generator')) {
      toast({
        title: "Usage Limit Reached",
        description: "Upgrade to Premium for unlimited access to all tools.",
        variant: "destructive"
      });
      return;
    }

    const countNum = parseInt(count);
    if (isNaN(countNum) || countNum <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      });
      return;
    }

    let generated = '';

    switch (type) {
      case 'words':
        generated = generateWords(countNum);
        break;
      case 'sentences':
        generated = generateSentences(countNum);
        break;
      case 'paragraphs':
        generated = generateParagraphs(countNum);
        break;
    }

    setResult(generated);
    trackToolUsage('lorem-generator');
    
    toast({
      title: "Lorem Ipsum Generated! 📝",
      description: `${countNum} ${type} generated successfully.`,
    });
  };

  const generateWords = (num: number) => {
    const words = [];
    const startWords = startWithLorem ? ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'] : [];
    
    words.push(...startWords);
    
    for (let i = startWords.length; i < num; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    
    return words.slice(0, num).join(' ') + '.';
  };

  const generateSentences = (num: number) => {
    const sentences = [];
    
    for (let i = 0; i < num; i++) {
      const sentenceLength = Math.floor(Math.random() * 10) + 8; // 8-17 words
      const words = [];
      
      if (i === 0 && startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        for (let j = 5; j < sentenceLength; j++) {
          words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
      } else {
        for (let j = 0; j < sentenceLength; j++) {
          words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
      }
      
      // Capitalize first word
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      sentences.push(words.join(' ') + '.');
    }
    
    return sentences.join(' ');
  };

  const generateParagraphs = (num: number) => {
    const paragraphs = [];
    
    for (let i = 0; i < num; i++) {
      const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
      const sentences = [];
      
      for (let j = 0; j < sentenceCount; j++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 8;
        const words = [];
        
        if (i === 0 && j === 0 && startWithLorem) {
          words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
          for (let k = 5; k < sentenceLength; k++) {
            words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
          }
        } else {
          for (let k = 0; k < sentenceLength; k++) {
            words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
          }
        }
        
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        sentences.push(words.join(' ') + '.');
      }
      
      paragraphs.push(sentences.join(' '));
    }
    
    return paragraphs.join('\n\n');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: "Copied! 📋",
        description: "Lorem ipsum text copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KPHN2Zz4=')] opacity-20"></div>
        
        <Navigation />
        
        <div className="relative py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
                <FileText className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-300">Text Tool</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Lorem Ipsum
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Generator
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Generate placeholder text for your designs and layouts with customizable options.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <UsageIndicator 
                usage={usage.toolsUsed} 
                limit={monthlyLimit} 
                isPremium={isPremium} 
              />

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className="text-white mb-2 block">Generate</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="words">Words</SelectItem>
                        <SelectItem value="sentences">Sentences</SelectItem>
                        <SelectItem value="paragraphs">Paragraphs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Count</Label>
                    <Input
                      type="number"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      min="1"
                      max="100"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateLorem}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 text-lg mb-6"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Generate Lorem Ipsum
                </Button>

                {/* Result */}
                {result && (
                  <div className="bg-white/10 border-white/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-white font-semibold">Generated Text</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyResult}
                        className="text-gray-400 hover:text-white p-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Textarea
                      value={result}
                      readOnly
                      className="bg-white/5 border-white/10 text-white h-64 resize-none"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <h3 className="text-blue-400 font-medium mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    About Lorem Ipsum
                  </h3>
                  <p className="text-sm text-gray-300">
                    Lorem Ipsum is placeholder text used in the printing and typesetting industry since the 1500s. 
                    It's derived from Cicero's "de Finibus Bonorum et Malorum" and helps focus on layout design 
                    without being distracted by readable content.
                  </p>
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