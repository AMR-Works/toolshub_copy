export async function getCurrencies() {
  try {
    const response = await fetch('https://openexchangerates.org/api/currencies.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch currencies:", error);
    return {};
  }
}