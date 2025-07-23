import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { usePremium } from '@/hooks/usePremium';

// Types
type IncomeType = 'salary' | 'business' | 'capital-gains' | 'other';

interface TaxSlab {
  min: number;
  max?: number;
  rate: number;
  description: string;
}

interface CountryTaxData {
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  taxYear: string;
  slabs: TaxSlab[];
  deductions: {
    standard: number;
    description: string;
  };
  additionalTaxes?: {
    name: string;
    condition: (income: number) => boolean;
    calculate: (tax: number) => number;
    description: string;
  }[];
  incomeTypeSpecific?: {
    [key in IncomeType]?: {
      additionalDeduction?: number;
      specialRates?: TaxSlab[];
      description: string;
    };
  };
}

// Sample data for all countries (simplified for demo)
const COUNTRY_TAX_DATA: Record<string, CountryTaxData> = {
  'IN': {
    name: 'India',
    code: 'IN',
    currency: 'INR',
    currencySymbol: '₹',
    taxYear: '2023-2024',
    deductions: {
      standard: 50000,
      description: 'Standard deduction of ₹50,000 for salaried individuals'
    },
    slabs: [
      { min: 0, max: 250000, rate: 0, description: 'No tax for income up to ₹2.5 lakh' },
      { min: 250001, max: 500000, rate: 0.05, description: '5% tax on income between ₹2.5-5 lakh' },
      { min: 500001, max: 1000000, rate: 0.2, description: '20% tax on income between ₹5-10 lakh' },
      { min: 1000001, rate: 0.3, description: '30% tax on income above ₹10 lakh' }
    ],
    additionalTaxes: [
      {
        name: 'Health and Education Cess',
        condition: (income) => income > 250000,
        calculate: (tax) => tax * 0.04,
        description: '4% cess on total tax amount'
      }
    ]
  },
  'US': {
    name: 'United States',
    code: 'US',
    currency: 'USD',
    currencySymbol: '$',
    taxYear: '2023',
    deductions: {
      standard: 12950,
      description: 'Standard deduction of $12,950 for single filers (2023)'
    },
    slabs: [
      { min: 0, max: 10275, rate: 0.1, description: '10% on income up to $10,275' },
      { min: 10276, max: 41775, rate: 0.12, description: '12% on income between $10,276-$41,775' },
      { min: 41776, max: 89075, rate: 0.22, description: '22% on income between $41,776-$89,075' },
      { min: 89076, max: 170050, rate: 0.24, description: '24% on income between $89,076-$170,050' },
      { min: 170051, max: 215950, rate: 0.32, description: '32% on income between $170,051-$215,950' },
      { min: 215951, max: 539900, rate: 0.35, description: '35% on income between $215,951-$539,900' },
      { min: 539901, rate: 0.37, description: '37% on income over $539,900' }
    ]
  },
  'GB': {
    name: 'United Kingdom',
    code: 'GB',
    currency: 'GBP',
    currencySymbol: '£',
    taxYear: '2023-2024',
    deductions: {
      standard: 12570,
      description: 'Personal allowance of £12,570'
    },
    slabs: [
      { min: 0, max: 12570, rate: 0, description: 'Personal allowance (0%)' },
      { min: 12571, max: 50270, rate: 0.2, description: 'Basic rate (20%)' },
      { min: 50271, max: 125140, rate: 0.4, description: 'Higher rate (40%)' },
      { min: 125141, rate: 0.45, description: 'Additional rate (45%)' }
    ]
  },
  // Add more countries as needed
};

// List of all countries with their codes and currencies
const ALL_COUNTRIES = [
  { name: 'India', code: 'IN', currency: 'INR', symbol: '₹' },
  { name: 'United States', code: 'US', currency: 'USD', symbol: '$' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£' },
  { name: 'Germany', code: 'DE', currency: 'EUR', symbol: '€' },
  { name: 'France', code: 'FR', currency: 'EUR', symbol: '€' },
  { name: 'Canada', code: 'CA', currency: 'CAD', symbol: 'C$' },
  { name: 'Australia', code: 'AU', currency: 'AUD', symbol: 'A$' },
  { name: 'Japan', code: 'JP', currency: 'JPY', symbol: '¥' },
  { name: 'China', code: 'CN', currency: 'CNY', symbol: '¥' },
  { name: 'Brazil', code: 'BR', currency: 'BRL', symbol: 'R$' },
  // Add more countries as needed
];

// Common currencies for display
const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

export const TaxCalculator: React.FC = () => {
  const { isPremium } = usePremium();
  const [selectedCountry, setSelectedCountry] = useState<CountryTaxData>(COUNTRY_TAX_DATA['IN']);
  const [incomeType, setIncomeType] = useState<IncomeType>('salary');
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [taxDetails, setTaxDetails] = useState<{
    totalTax: number;
    breakdown: { name: string; amount: number; description: string }[];
    taxableIncome: number;
    effectiveRate: number;
  } | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState('$');
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  const resultRef = useRef<HTMLDivElement>(null);

  const calculateTax = () => {
    if (annualIncome === null || annualIncome < 0) {
      setTaxDetails(null);
      return;
    }

    const config = selectedCountry;
    let taxableIncome = annualIncome - config.deductions.standard;
    taxableIncome = Math.max(0, taxableIncome);

    // Check for income type specific rules
    const incomeTypeConfig = config.incomeTypeSpecific?.[incomeType];
    if (incomeTypeConfig?.additionalDeduction) {
      taxableIncome -= incomeTypeConfig.additionalDeduction;
      taxableIncome = Math.max(0, taxableIncome);
    }

    // Use special rates if available for this income type
    const slabsToUse = incomeTypeConfig?.specialRates || config.slabs;

    let tax = 0;
    const breakdown: { name: string; amount: number; description: string }[] = [];
    
    // Calculate tax based on slabs
    for (let i = 0; i < slabsToUse.length; i++) {
      const slab = slabsToUse[i];
      if (taxableIncome > slab.min) {
        const amountInSlab = slab.max 
          ? Math.min(taxableIncome, slab.max) - slab.min 
          : taxableIncome - slab.min;
        
        if (amountInSlab > 0) {
          const taxForSlab = amountInSlab * slab.rate;
          tax += taxForSlab;
          breakdown.push({
            name: `${config.currencySymbol}${slab.min.toLocaleString()}${slab.max ? `-${slab.max.toLocaleString()}` : '+'}`,
            amount: taxForSlab,
            description: slab.description
          });
        }
      }
    }

    // Add standard deduction to breakdown
    breakdown.unshift({
      name: 'Standard Deduction',
      amount: -config.deductions.standard,
      description: config.deductions.description
    });

    // Add any additional deductions
    if (incomeTypeConfig?.additionalDeduction) {
      breakdown.unshift({
        name: 'Additional Deduction',
        amount: -incomeTypeConfig.additionalDeduction,
        description: incomeTypeConfig.description
      });
    }

    // Calculate additional taxes if any
    if (config.additionalTaxes) {
      for (const additionalTax of config.additionalTaxes) {
        if (additionalTax.condition(taxableIncome)) {
          const amount = additionalTax.calculate(tax);
          tax += amount;
          breakdown.push({
            name: additionalTax.name,
            amount: amount,
            description: additionalTax.description
          });
        }
      }
    }

    const effectiveRate = annualIncome > 0 ? (tax / annualIncome) * 100 : 0;

    setTaxDetails({
      totalTax: tax,
      breakdown,
      taxableIncome,
      effectiveRate
    });
  };

  const exportImage = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current);
      const link = document.createElement('a');
      link.download = 'tax_result.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const exportCSV = () => {
    if (!taxDetails) return;
    
    const headers = [
      "Country,Income Type,Annual Income,Taxable Income,Total Tax,Effective Rate",
      `"${selectedCountry.name}","${incomeType}","${selectedCountry.currencySymbol}${annualIncome?.toFixed(2) || '0.00'}","${selectedCountry.currencySymbol}${taxDetails.taxableIncome.toFixed(2)}","${selectedCountry.currencySymbol}${taxDetails.totalTax.toFixed(2)}","${taxDetails.effectiveRate.toFixed(2)}%"`
    ].join('\n');
    
    const breakdown = taxDetails.breakdown.map(item => 
      `"${item.name}","${item.amount >= 0 ? '+' : ''}${selectedCountry.currencySymbol}${Math.abs(item.amount).toFixed(2)}","${item.description}"`
    ).join('\n');
    
    const csvContent = [headers, "", "Breakdown,Amount,Description", breakdown].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${selectedCountry.code}_tax_data.csv`);
  };

  const filteredCountries = ALL_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Global Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Country</Label>
              <div className="relative">
                <Input
                  placeholder="Search country..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                  className="pr-10"
                />
                {countrySearchTerm && (
                  <button
                    onClick={() => setCountrySearchTerm('')}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedCountry.code === country.code ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      setSelectedCountry(COUNTRY_TAX_DATA[country.code] || COUNTRY_TAX_DATA['IN']);
                      setCountrySearchTerm('');
                    }}
                  >
                    {country.name} ({country.currency})
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Income Type</Label>
              <RadioGroup 
                value={incomeType} 
                onValueChange={(value) => setIncomeType(value as IncomeType)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="salary" id="salary" />
                  <Label htmlFor="salary">Salary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">Business</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="capital-gains" id="capital-gains" />
                  <Label htmlFor="capital-gains">Capital Gains</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>
              Annual Income ({selectedCountry.currencySymbol})
            </Label>
            <Input
              type="number"
              value={annualIncome ?? ''}
              onChange={(e) => setAnnualIncome(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder={`Enter amount in ${selectedCountry.currency}`}
              min="0"
            />
          </div>

          <div className="grid gap-2">
            <Label>Display Currency</Label>
            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {COMMON_CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.symbol}>
                  {currency.symbol} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={calculateTax}>
            Calculate Tax
          </Button>

          {taxDetails && isPremium && (
            <div className="grid gap-4 mt-6 p-4 border rounded-lg bg-gray-50" ref={resultRef}>
              <h3 className="text-lg font-semibold">Tax Calculation Results</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Country:</strong> {selectedCountry.name}</p>
                  <p><strong>Income Type:</strong> {incomeType}</p>
                  <p><strong>Tax Year:</strong> {selectedCountry.taxYear}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Annual Income:</strong> {selectedCountry.currencySymbol}{annualIncome?.toLocaleString()}</p>
                  <p><strong>Taxable Income:</strong> {selectedCountry.currencySymbol}{taxDetails.taxableIncome.toLocaleString()}</p>
                  <p className="font-bold text-lg">
                    <strong>Total Tax Owed:</strong> {selectedCountry.currencySymbol}{taxDetails.totalTax.toFixed(2)}
                  </p>
                  <p><strong>Effective Tax Rate:</strong> {taxDetails.effectiveRate.toFixed(2)}%</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Calculation Breakdown:</h4>
                <div className="space-y-3">
                  {taxDetails.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-white rounded-lg shadow-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <p className={`font-mono ${item.amount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.amount >= 0 ? '+' : ''}{selectedCountry.currencySymbol}{Math.abs(item.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Tax Slabs for {selectedCountry.name}:</h4>
                <div className="space-y-2">
                  {selectedCountry.slabs.map((slab, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 bg-white rounded-lg">
                      <div className="w-24 font-mono text-sm">
                        {selectedCountry.currencySymbol}{slab.min.toLocaleString()}
                        {slab.max ? `-${selectedCountry.currencySymbol}${slab.max.toLocaleString()}` : '+'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{(slab.rate * 100)}%</span>
                          <span className="text-sm text-gray-600">{slab.description}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={exportImage} className="flex-1">
                  Export as Image
                </Button>
                <Button variant="outline" onClick={exportCSV} className="flex-1">
                  Export as CSV
                </Button>
              </div>
            </div>
          )}

          {taxDetails && !isPremium && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-md text-center">
              <p className="font-semibold">Unlock Detailed Results and Export Options!</p>
              <p className="text-sm">Become a premium user to view a detailed breakdown of your tax calculation and export your results.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;