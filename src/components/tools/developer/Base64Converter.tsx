import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Base64Converter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');

  const encodeToBase64 = useCallback(() => {
    try {
      setOutputText(btoa(inputText));
      toast.success('Text encoded to Base64!');
    } catch (error) {
      toast.error('Failed to encode: Invalid characters detected.');
      setOutputText('');
    }
  }, [inputText]);

  const decodeFromBase64 = useCallback(() => {
    try {
      setOutputText(atob(inputText));
      toast.success('Text decoded from Base64!');
    } catch (error) {
      toast.error('Failed to decode: Invalid Base64 string.');
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
        <CardTitle>Base64 Encoder / Decoder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="inputText" className="mb-2 block">Input Text</Label>
            <Textarea
              id="inputText"
              placeholder="Enter text to encode or decode..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="font-mono"
            />
            <div className="flex space-x-2 mt-4">
              <Button onClick={encodeToBase64}>Encode</Button>
              <Button onClick={decodeFromBase64}>Decode</Button>
              <Button variant="outline" onClick={clearFields}><RefreshCw className="h-4 w-4 mr-2" /> Clear</Button>
            </div>
          </div>
          <div>
            <Label htmlFor="outputText" className="mb-2 block">Output Text</Label>
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

export default Base64Converter;