import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const RegexTester: React.FC = () => {
  const [regexPattern, setRegexPattern] = useState<string>('');
  const [testString, setTestString] = useState<string>('');
  const [globalFlag, setGlobalFlag] = useState<boolean>(true);
  const [caseInsensitiveFlag, setCaseInsensitiveFlag] = useState<boolean>(false);
  const [multilineFlag, setMultilineFlag] = useState<boolean>(false);
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const flags = useMemo(() => {
    let f = '';
    if (globalFlag) f += 'g';
    if (caseInsensitiveFlag) f += 'i';
    if (multilineFlag) f += 'm';
    return f;
  }, [globalFlag, caseInsensitiveFlag, multilineFlag]);

  const highlightText = useCallback((text: string, pattern: RegExp) => {
    if (!pattern || pattern.source === '') return text;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    text.replace(pattern, (match, offset) => {
      if (offset > lastIndex) {
        parts.push(text.substring(lastIndex, offset));
      }
      parts.push(<span key={offset} className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">{match}</span>);
      lastIndex = offset + match.length;
      return match; // Return match to keep replace working
    });

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return <>{parts}</>;
  }, []);

  const runTest = useCallback(() => {
    if (!regexPattern) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const regex = new RegExp(regexPattern, flags);
      const currentMatches: string[] = [];
      let match;

      if (globalFlag) {
        while ((match = regex.exec(testString)) !== null) {
          currentMatches.push(match[0]);
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          currentMatches.push(match[0]);
        }
      }

      setMatches(currentMatches);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
      toast.error('Invalid Regex: ' + e.message);
    }
  }, [regexPattern, testString, flags, globalFlag]);

  React.useEffect(() => {
    runTest();
  }, [regexPattern, testString, flags, runTest]);

  const renderedTestString = useMemo(() => {
    if (error || !regexPattern) return testString;
    try {
      const regex = new RegExp(regexPattern, flags);
      return highlightText(testString, regex);
    } catch {
      return testString;
    }
  }, [testString, regexPattern, flags, error, highlightText]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Regex Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div>
            <Label htmlFor="regexPattern" className="mb-2 block">Regular Expression</Label>
            <Input
              id="regexPattern"
              placeholder="e.g., ^\d{3}-\d{2}-\d{4}$"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              className="font-mono"
            />
            {error && <p className="text-red-500 text-sm mt-1">Error: {error}</p>}
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="globalFlag"
                  checked={globalFlag}
                  onCheckedChange={(checked) => setGlobalFlag(Boolean(checked))}
                />
                <Label htmlFor="globalFlag">Global (g)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="caseInsensitiveFlag"
                  checked={caseInsensitiveFlag}
                  onCheckedChange={(checked) => setCaseInsensitiveFlag(Boolean(checked))}
                />
                <Label htmlFor="caseInsensitiveFlag">Case Insensitive (i)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multilineFlag"
                  checked={multilineFlag}
                  onCheckedChange={(checked) => setMultilineFlag(Boolean(checked))}
                />
                <Label htmlFor="multilineFlag">Multiline (m)</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="testString" className="mb-2 block">Test String</Label>
            <Textarea
              id="testString"
              placeholder="Enter text to test against the regex..."
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              rows={8}
              className="font-mono"
            />
          </div>

          <div>
            <Label className="mb-2 block">Matches</Label>
            <ScrollArea className="h-40 w-full rounded-md border p-4 font-mono bg-muted">
              {matches.length > 0 ? (
                matches.map((match, index) => (
                  <p key={index} className="break-all">{match}</p>
                ))
              ) : (
                <p className="text-muted-foreground">No matches found or invalid regex.</p>
              )}
            </ScrollArea>
          </div>

          <div>
            <Label className="mb-2 block">Live Preview</Label>
            <div className="w-full rounded-md border p-4 font-mono bg-muted min-h-[100px]">
              {renderedTestString}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegexTester;