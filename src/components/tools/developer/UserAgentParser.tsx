import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ParsedUserAgent {
  browser: { name: string; version: string; };
  os: { name: string; version: string; };
  device: { type: string; vendor: string; model: string; };
  cpu: { architecture: string; };
  engine: { name: string; version: string; };
}

// A very basic user-agent parser for demonstration purposes.
// In a real application, you'd use a robust library like 'ua-parser-js'.
const parseUserAgentString = (uaString: string): ParsedUserAgent => {
  const result: ParsedUserAgent = {
    browser: { name: 'Unknown', version: '' },
    os: { name: 'Unknown', version: '' },
    device: { type: 'Unknown', vendor: '', model: '' },
    cpu: { architecture: '' },
    engine: { name: 'Unknown', version: '' },
  };

  // Browser
  let match = uaString.match(/(firefox|msie|trident\/[0-9.]+; rv:)([0-9.]+)/i) ||
              uaString.match(/(edge|chrome|safari|opera|opr)\/([0-9.]+)/i);
  if (match) {
    result.browser.name = match[1].replace('opr', 'Opera').replace('trident', 'IE').replace('msie', 'IE');
    result.browser.version = match[2];
  } else if (uaString.includes('Edg')) {
    result.browser.name = 'Edge';
    match = uaString.match(/Edg\/([0-9.]+)/i);
    if (match) result.browser.version = match[1];
  }

  // OS
  match = uaString.match(/(windows|mac os x|android|ios|linux)(?: |\/)([0-9._]+)?/i);
  if (match) {
    result.os.name = match[1].replace(/os x/i, 'macOS');
    result.os.version = match[2] ? match[2].replace(/_/g, '.') : '';
  }

  // Engine (simplified)
  match = uaString.match(/(webkit|gecko|presto|blink)\/([0-9.]+)/i);
  if (match) {
    result.engine.name = match[1];
    result.engine.version = match[2];
  }

  // Device Type (very basic)
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(uaString)) {
    result.device.type = 'Tablet';
  } else if (/(mobile|ip(hone|od)|android|blackberry|fennec|opera m(ob|in)i|windows (ce|phone)|symbian|series40)/i.test(uaString)) {
    result.device.type = 'Mobile';
  } else {
    result.device.type = 'Desktop';
  }

  return result;
};

const UserAgentParser: React.FC = () => {
  const [userAgentInput, setUserAgentInput] = useState<string>(navigator.userAgent);

  const parsedResult = useMemo(() => {
    if (!userAgentInput) return null;
    return parseUserAgentString(userAgentInput);
  }, [userAgentInput]);

  const clearFields = useCallback(() => {
    setUserAgentInput('');
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } else {
      toast.info('Nothing to copy!');
    }
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User-Agent Parser</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="userAgentInput" className="mb-2 block">User-Agent String</Label>
            <Textarea
              id="userAgentInput"
              placeholder="Enter User-Agent string..."
              value={userAgentInput}
              onChange={(e) => setUserAgentInput(e.target.value)}
              rows={5}
              className="font-mono"
            />
            <div className="flex space-x-2 mt-4">
              <Button onClick={() => setUserAgentInput(navigator.userAgent)}>Use Current UA</Button>
              <Button variant="outline" onClick={clearFields}><RefreshCw className="h-4 w-4 mr-2" /> Clear</Button>
            </div>
          </div>

          {parsedResult && (
            <div className="grid gap-2">
              <Label className="mb-2 block">Parsed Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Browser</h3>
                  <p>Name: <span className="font-mono">{parsedResult.browser.name}</span></p>
                  <p>Version: <span className="font-mono">{parsedResult.browser.version}</span></p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Operating System</h3>
                  <p>Name: <span className="font-mono">{parsedResult.os.name}</span></p>
                  <p>Version: <span className="font-mono">{parsedResult.os.version}</span></p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Device</h3>
                  <p>Type: <span className="font-mono">{parsedResult.device.type}</span></p>
                  <p>Vendor: <span className="font-mono">{parsedResult.device.vendor || 'N/A'}</span></p>
                  <p>Model: <span className="font-mono">{parsedResult.device.model || 'N/A'}</span></p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Engine</h3>
                  <p>Name: <span className="font-mono">{parsedResult.engine.name}</span></p>
                  <p>Version: <span className="font-mono">{parsedResult.engine.version}</span></p>
                </div>
              </div>
              <Button onClick={() => copyToClipboard(JSON.stringify(parsedResult, null, 2))} className="mt-4 w-full">
                <Copy className="h-4 w-4 mr-2" /> Copy Parsed JSON
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAgentParser;