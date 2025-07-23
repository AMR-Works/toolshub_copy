import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const UUIDGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUUID = useCallback(() => {
    // Generate a UUID v4
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setUuids((prevUuids) => [uuid, ...prevUuids].slice(0, 10)); // Keep last 10 UUIDs
    toast.success('New UUID generated!');
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('UUID copied to clipboard!');
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>UUID Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Button onClick={generateUUID} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" /> Generate New UUID
          </Button>
          <div className="space-y-2">
            {uuids.length === 0 ? (
              <p className="text-muted-foreground text-center">Click "Generate New UUID" to create one.</p>
            ) : (
              uuids.map((uuid, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input type="text" value={uuid} readOnly className="font-mono" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(uuid)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UUIDGenerator;