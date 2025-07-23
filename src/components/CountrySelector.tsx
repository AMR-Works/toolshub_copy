import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface CountryData {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  flag: string;
  basePrice: number; // Price ending in .99
  taxRate: number;
  taxName: string;
}

export const countries: CountryData[] = [
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$', flag: '🇺🇸', basePrice: 5.99, taxRate: 0.08, taxName: 'Sales Tax' },
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹', flag: '🇮🇳', basePrice: 499, taxRate: 0.18, taxName: 'GST' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', flag: '🇬🇧', basePrice: 4.99, taxRate: 0.20, taxName: 'VAT' },
  { code: 'EU', name: 'European Union', currency: 'EUR', symbol: '€', flag: '🇪🇺', basePrice: 5.99, taxRate: 0.19, taxName: 'VAT' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$', flag: '🇨🇦', basePrice: 7.99, taxRate: 0.13, taxName: 'HST' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$', flag: '🇦🇺', basePrice: 8.99, taxRate: 0.10, taxName: 'GST' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥', flag: '🇯🇵', basePrice: 899, taxRate: 0.10, taxName: 'Consumption Tax' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', symbol: 'R$', flag: '🇧🇷', basePrice: 29.99, taxRate: 0.17, taxName: 'ICMS' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', symbol: '$', flag: '🇲🇽', basePrice: 119.99, taxRate: 0.16, taxName: 'IVA' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$', flag: '🇸🇬', basePrice: 7.99, taxRate: 0.07, taxName: 'GST' },
];

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
}) => {
  return (
    <div className="mb-2 mx-auto">
      <Select value={selectedCountry} onValueChange={onCountryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose your country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <span className="text-muted-foreground">({country.currency})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};