// Turkish character normalization map
const turkishCharMap: Record<string, string> = {
  'İ': 'i', 'I': 'ı', 'Ğ': 'ğ', 'Ü': 'ü', 'Ş': 'ş', 'Ö': 'ö', 'Ç': 'ç',
  'i̇': 'i', 'ı': 'ı', 'ğ': 'ğ', 'ü': 'ü', 'ş': 'ş', 'ö': 'ö', 'ç': 'ç'
};

export function normalizeText(text: string): string {
  return text
    .trim()
    .toLocaleLowerCase('tr-TR') // Use Turkish locale for proper case conversion
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .split('')
    .map(char => turkishCharMap[char] || char)
    .join('');
}

export function equalsMeaning(userInput: string, correctAnswer: string): boolean {
  if (!userInput.trim() || !correctAnswer.trim()) return false;
  if (userInput.length > 1000 || correctAnswer.length > 1000) return false;
  
  const normalizedInput = normalizeText(userInput.trim());
  const normalizedAnswer = normalizeText(correctAnswer.trim());
  
  return normalizedInput === normalizedAnswer;
}

