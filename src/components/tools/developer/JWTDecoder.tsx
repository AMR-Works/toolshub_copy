import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const JWTDecoder: React.FC = () => {
  const [jwtToken, setJwtToken] = useState<string>('');

  const decodeJwt = useCallback((token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. A JWT must have 3 parts separated by dots.');
      }

      const decodePart = (part: string) => {
        // Replace - with + and _ with / for URL-safe Base64
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        // Pad with = to ensure correct Base64 length
        const paddedBase64 = base64 + '==='.slice((base64.length + 3) % 4);
        return JSON.parse(atob(paddedBase64));
      };

      const header = decodePart(parts[0]);
      const payload = decodePart(parts[1]);

      return {
        header: JSON.stringify(header, null, 2),
        payload: JSON.stringify(payload, null, 2),
        signature: parts[2],
      };
    } catch (e: any) {
      toast.error(`Decoding Error: ${e.message}`);
      return {
        header: 'Invalid Token',
        payload: 'Invalid Token',
        signature: 'Invalid Token',
      };
    }
  }, []);

  const decoded = useMemo(() => decodeJwt(jwtToken), [jwtToken, decodeJwt]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>JWT Decoder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="jwtToken" className="mb-2 block">JWT Token</Label>
            <Textarea
              id="jwtToken"
              placeholder="Enter your JWT token here..."
              value={jwtToken}
              onChange={(e) => setJwtToken(e.target.value)}
              rows={6}
              className="font-mono"
            />
          </div>

          <Tabs defaultValue="payload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="payload">Payload</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
            </TabsList>
            <TabsContent value="header">
              <ScrollArea className="h-60 w-full rounded-md border p-4 font-mono bg-muted">
                <pre>{decoded.header}</pre>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="payload">
              <ScrollArea className="h-60 w-full rounded-md border p-4 font-mono bg-muted">
                <pre>{decoded.payload}</pre>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="signature">
              <ScrollArea className="h-60 w-full rounded-md border p-4 font-mono bg-muted">
                <pre>{decoded.signature}</pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default JWTDecoder;