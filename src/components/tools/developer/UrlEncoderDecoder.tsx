import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const UrlEncoderDecoder: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');

  const encodeUrl = useCallback(() => {
    if (!inputText) {
      setOutputText('');
      toast.info('Enter text to encode.');
      return;
    }
    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
      toast.success('URL encoded!');
    } catch (e: any) {
      toast.error(`Encoding Error: ${e.message}`);
      setOutputText('');
    }
  }, [inputText]);

  const decodeUrl = useCallback(() => {
    if (!inputText) {
      setOutputText('');
      toast.info('Enter text to decode.');
      return;
    }
    try {
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
      toast.success('URL decoded!');
    } catch (e: any) {
      toast.error(`Decoding Error: ${e.message}`);
      setOutputText('');
    }
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
        <CardTitle>URL Encoder / Decoder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="inputText" className="mb-2 block">Input URL</Label>
            <Textarea
              id="inputText"
              placeholder="Enter URL to encode or decode..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="font-mono"
            />
            <div className="flex space-x-2 mt-4">
              <Button onClick={encodeUrl}>Encode</Button>
              <Button onClick={decodeUrl}>Decode</Button>
              <Button variant="outline" onClick={clearFields}><RefreshCw className="h-4 w-4 mr-2" /> Clear</Button>
            </div>
          </div>
          <div>
            <Label htmlFor="outputText" className="mb-2 block">Output URL</Label>
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

export default UrlEncoderDecoder;