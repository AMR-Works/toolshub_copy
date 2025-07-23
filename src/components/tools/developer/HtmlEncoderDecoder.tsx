import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const HtmlEncoderDecoder: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');

  const encodeHtml = useCallback(() => {
    if (!inputText) {
      setOutputText('');
      toast.info('Enter text to encode.');
      return;
    }
    const encoded = inputText.replace(/&/g, '&amp;')
                             .replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;')
                             .replace(/"/g, '&quot;')
                             .replace(/'/g, '&#039;');
    setOutputText(encoded);
    toast.success('HTML encoded!');
  }, [inputText]);

  const decodeHtml = useCallback(() => {
    if (!inputText) {
      setOutputText('');
      toast.info('Enter text to decode.');
      return;
    }
    const decoded = inputText.replace(/&amp;/g, '&')
                             .replace(/&lt;/g, '<')
                             .replace(/&gt;/g, '>')
                             .replace(/&quot;/g, '"')
                             .replace(/&#039;/g, "'");
    setOutputText(decoded);
    toast.success('HTML decoded!');
  }, [inputText]);

  const clearFields = useCallback(() => {
    setInputText('');
    setOutputText('');
  }, []);

  const copyToClipboard = useCallback(() => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      toast.success('Output copied to clipboard!');
    } else {
      toast.info('Nothing to copy!');
    }
  }, [outputText]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>HTML Encoder / Decoder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="inputText" className="mb-2 block">Input HTML</Label>
            <Textarea
              id="inputText"
              placeholder="Enter HTML to encode or decode..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="font-mono"
            />
            <div className="flex space-x-2 mt-4">
              <Button onClick={encodeHtml}>Encode</Button>
              <Button onClick={decodeHtml}>Decode</Button>
              <Button variant="outline" onClick={clearFields}><RefreshCw className="h-4 w-4 mr-2" /> Clear</Button>
            </div>
          </div>
          <div>
            <Label htmlFor="outputText" className="mb-2 block">Output HTML</Label>
            <Textarea
              id="outputText"
              readOnly
              value={outputText}
              rows={10}
              className="font-mono bg-muted"
            />
            <Button onClick={copyToClipboard} className="mt-4 w-full">
              <Copy className="h-4 w-4 mr-2" /> Copy Output
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HtmlEncoderDecoder;