import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  ArrowRightLeft, RefreshCw, Loader2, Search, DollarSign, Download,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { saveAs } from 'file-saver';

const API_URL = 'https://open.er-api.com/v6/latest';

export const CurrencyConversion: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [converted, setConverted] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [allCodes, setAllCodes] = useState<string[]>([]);
  const errorToastRef = useRef(false);

  const fetchRates = async (base: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${base}`);
      const data = await res.json();
      if (data.result !== 'success') throw new Error(data['error-type']);
      setRates(data.rates);
      setLastUpdate(new Date(data.time_last_update_utc).toLocaleString());
      setAllCodes(Object.keys(data.rates).sort());
      errorToastRef.current = false;
    } catch (err) {
      if (!errorToastRef.current) {
        toast({
          title: 'Error fetching rates',
          description: 'Using existing rates or retry later.',
          variant: 'destructive',
        });
        errorToastRef.current = true;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const convert = () => {
    if (isNaN(amount)) { setConverted(null); return; }
    if (fromCurrency === toCurrency) return setConverted(amount);
    if (rates[toCurrency]) {
      setConverted(amount * rates[toCurrency]);
    } else {
      setConverted(null);
      toast({
        title: 'Conversion error',
        description: `No rate for ${toCurrency}`,
        variant: 'destructive',
      });
    }
  };

  const swap = () => {
    const a = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(a);
  };

  const exportResult = () => {
    if (converted === null) return;

    const content = [
      `Currency Conversion Result`,
      `Downloaded Time: ${new Date().toLocaleString()}`,
      `Last Updated Rates at: ${lastUpdate}`,
      ``,
      `${amount} ${fromCurrency} = ${converted.toFixed(6)} ${toCurrency}`,
      `Rate: 1 ${fromCurrency} = ${(rates[toCurrency] || 0).toFixed(6)} ${toCurrency}`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `currency_conversion_${fromCurrency}_to_${toCurrency}.txt`);
  };

  useEffect(() => { fetchRates(fromCurrency); }, [fromCurrency]);
  useEffect(() => {
    if (Object.keys(rates).length > 0 && rates[toCurrency]) {
      convert();
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  return (
    <Card className="w-full max-w-2xl mx-auto p-4">
      <CardHeader>
        <CardTitle className="flex justify-center items-center gap-2 text-xl sm:text-2xl">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" /> Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div>
          <Label>Amount</Label>
          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium">
              {fromCurrency}
            </span>
          </div>
        </div>

        {/* Currency Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label>From Currency</Label>
            <Select
              value={fromCurrency}
              onValueChange={setFromCurrency}
              disabled={isLoading}
            >
              <SelectTrigger className="h-12">
                <SelectValue>{fromCurrency}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <div className="relative px-2 mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchFrom}
                    onChange={e => setSearchFrom(e.target.value)}
                    placeholder="Search..."
                    className="pl-8"
                  />
                </div>
                {allCodes
                  .filter(c => c.toLowerCase().includes(searchFrom.toLowerCase()))
                  .map(code => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant="outline"
                onClick={swap}
                disabled={isLoading}
                className="h-12 w-12"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          <div>
            <Label>To Currency</Label>
            <Select
              value={toCurrency}
              onValueChange={setToCurrency}
              disabled={isLoading}
            >
              <SelectTrigger className="h-12">
                <SelectValue>{toCurrency}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <div className="relative px-2 mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTo}
                    onChange={e => setSearchTo(e.target.value)}
                    placeholder="Search..."
                    className="pl-8"
                  />
                </div>
                {allCodes
                  .filter(c => c.toLowerCase().includes(searchTo.toLowerCase()))
                  .map(code => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            onClick={() => fetchRates(fromCurrency)}
            disabled={isLoading}
            className="flex items-center gap-2 justify-center"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh Rates
          </Button>

          {converted !== null && (
            <Button
              onClick={exportResult}
              variant="secondary"
              className="flex items-center gap-2 justify-center"
            >
              <Download className="h-4 w-4" />
              Export Result
            </Button>
          )}
        </div>

        {/* Result Display */}
        {converted !== null && (
          <div className="text-center space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-bold p-4 bg-green-100 dark:bg-green-500 border border-green-200 dark:border-green-800 rounded-lg"
            >
              {amount.toLocaleString()} {fromCurrency} = {converted.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCurrency}
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Rates last updated: {lastUpdate}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyConversion;
