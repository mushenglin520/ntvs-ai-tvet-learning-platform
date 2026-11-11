export function calculateScore(correctCount: number, totalCount: number) {
  if (totalCount <= 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
}

export function isCorrectAnswer(selected: string, answer: string) {
  return selected.trim().toUpperCase() === answer.trim().toUpperCase();
}
