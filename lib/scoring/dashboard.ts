export type AttemptRow = {
  created_at: string;
  is_correct: boolean;
  difficulty: number;
  topic_tags: string[];
  thinking_errors: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function weightedAccuracy(attempts: AttemptRow[]) {
  if (!attempts.length) return 0;
  let correctWeight = 0;
  let totalWeight = 0;
  attempts.forEach((attempt, index) => {
    const recentBoost = index < 10 ? 2 : 1;
    const difficultyBoost = 1 + (attempt.difficulty - 1) * 0.08;
    const weight = recentBoost * difficultyBoost;
    totalWeight += weight;
    if (attempt.is_correct) correctWeight += weight;
  });
  return correctWeight / totalWeight;
}

export function calculateDashboard(attemptsDesc: AttemptRow[]) {
  const current = attemptsDesc.slice(0, 50);
  const previous = attemptsDesc.slice(30, 80);
  const score = Math.round(clamp(weightedAccuracy(current) * 100, 0, 100));
  const previousScore = previous.length ? Math.round(weightedAccuracy(previous) * 100) : score;
  const trend = score - previousScore;

  const topicStats: Record<string, { total: number; correct: number }> = {};
  const errorStats: Record<string, number> = {};

  current.forEach((attempt) => {
    attempt.topic_tags.forEach((tag) => {
      if (!topicStats[tag]) topicStats[tag] = { total: 0, correct: 0 };
      topicStats[tag].total += 1;
      if (attempt.is_correct) topicStats[tag].correct += 1;
    });

    attempt.thinking_errors.forEach((error) => {
      errorStats[error] = (errorStats[error] ?? 0) + 1;
    });
  });

  const topicRows = Object.entries(topicStats)
    .map(([topic, stat]) => ({ topic, count: stat.total, accuracy: stat.correct / stat.total }))
    .filter((row) => row.count >= 5);

  const strengths = [...topicRows].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);
  const weaknesses = [...topicRows].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const topThinkingErrors = Object.entries(errorStats)
    .map(([error, count]) => ({ error, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const trendLast30 = attemptsDesc.slice(0, 30).map((attempt) => (attempt.is_correct ? 1 : 0));

  return { score, trend, strengths, weaknesses, topThinkingErrors, trendLast30 };
}
