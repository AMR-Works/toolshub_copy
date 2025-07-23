import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { UsageIndicator } from '@/components/UsageIndicator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { FileText, Hash, Clock, Eye } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';

export const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });
  const { usage, isPremium, monthlyLimit } = useUsageTracking();

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (inputText: string) => {
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    
    // Words count
    const words = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
    
    // Sentences count (split by . ! ?)
    const sentences = inputText.trim() === '' ? 0 : inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Paragraphs count (split by double newlines)
    const paragraphs = inputText.trim() === '' ? 0 : inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime
    });
  };

  const statCards = [
    {
      icon: FileText,
      label: 'Characters',
      value: stats.characters.toLocaleString(),
      color: 'text-blue-400'
    },
    {
      icon: Hash,
      label: 'Characters (no spaces)',
      value: stats.charactersNoSpaces.toLocaleString(),
      color: 'text-green-400'
    },
    {
      icon: FileText,
      label: 'Words',
      value: stats.words.toLocaleString(),
      color: 'text-purple-400'
    },
    {
      icon: Eye,
      label: 'Sentences',
      value: stats.sentences.toLocaleString(),
      color: 'text-orange-400'
    },
    {
      icon: FileText,
      label: 'Paragraphs',
      value: stats.paragraphs.toLocaleString(),
      color: 'text-pink-400'
    },
    {
      icon: Clock,
      label: 'Reading time',
      value: `${stats.readingTime} min`,
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KPHN2Zz4=')] opacity-20"></div>
        
        <Navigation />
        
        <div className="relative py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
                <FileText className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-300">Text Tool</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Word
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Counter
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Count words, characters, sentences, and get reading time estimates for your text.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <UsageIndicator 
                usage={usage.toolsUsed} 
                limit={monthlyLimit} 
                isPremium={isPremium} 
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Text Input */}
                <div className="lg:col-span-2">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <Label className="text-white mb-3 block text-lg font-semibold">
                      Enter Your Text
                    </Label>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Start typing or paste your text here..."
                      className="bg-white/10 border-white/20 text-white h-96 resize-none"
                    />
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-4">
                  {statCards.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                            <IconComponent className={`w-5 h-5 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <p className={`text-lg font-semibold ${stat.color}`}>
                              {stat.value}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Additional Info */}
              {text && (
                <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Text Analysis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Average word length</p>
                      <p className="text-white font-medium">
                        {stats.words > 0 ? (stats.charactersNoSpaces / stats.words).toFixed(1) : 0} characters
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">Average sentence length</p>
                      <p className="text-white font-medium">
                        {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0} words
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">Keyword density</p>
                      <p className="text-white font-medium">
                        {stats.characters > 0 ? ((stats.words / stats.characters) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-blue-400 font-medium mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Writing Tips
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Average reading speed is 200-250 words per minute</li>
                  <li>• Optimal sentence length is 15-20 words for readability</li>
                  <li>• Social media posts: Twitter 280 chars, LinkedIn 600 chars</li>
                  <li>• Blog posts: 1,500-2,500 words for SEO optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};