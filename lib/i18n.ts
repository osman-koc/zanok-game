export const strings = {
  // App name
  appName: 'Zanok',
  
  // Spin Wheel Screen
  spinWheelTitle: 'Çarkı Çevir',
  spinButton: 'Çevir',
  
  // Wheel segments
  segmentWord: 'Kelime',
  segmentHint: 'İpucu',
  segmentDouble: 'Çift Puan',
  segmentLife: '+1 Can',
  segmentEmpty: 'Boş',
  
  // Guess Screen
  guessTitle: 'Kelime Alıştırması',
  inputPlaceholder: 'Anlamını yaz…',
  checkButton: 'Kontrol Et',
  hintButton: 'İpucu',
  
  // Feedback
  correctAnswer: '✅ Doğru! Bugün toplam {count} doğru.',
  wrongAnswer: '❌ Yanlış! Doğrusu: "{answer}"',
  gameOver: 'Bitti',
  
  // Add Word Screen
  addWordTitle: 'Kelime Ekle',
  termLabel: 'Kelime',
  meaningLabel: 'Anlamı',
  saveButton: 'Kaydet',
  duplicateWarning: 'Bu kelime zaten mevcut!',
  wordSaved: 'Kelime kaydedildi!',
  
  // Stats
  todayStats: 'Bugün: {correct} ✅ / {wrong} ❌',
  streak: 'Seri: {days} gün',
  
  // Result Screen
  youWon: 'KAZANDIN!',
  youLost: 'KAYBETTİN!',
  congratulations: 'TEBRİKLER',
  tryAgain: 'TEKRAR DENE',
  playAgain: 'Tekrar Oyna',
  addWords: 'Kelime Ekle',
  
  // Empty state
  noWords: 'Henüz kelime yok!',
  addFirstWord: 'İlk kelimeni ekle',
  
  // Navigation
  back: 'Geri',
};

export function formatString(template: string, values: Record<string, string>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key] || match;
  });
}