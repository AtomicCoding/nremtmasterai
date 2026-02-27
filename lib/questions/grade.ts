import { Question } from "./bank";

export function gradeQuestion(question: Question, selectedChoice: "A" | "B" | "C" | "D") {
  const isCorrect = question.correct === selectedChoice;
  const whyCorrect = `Correct answer is ${question.correct}: ${question.choices[question.correct]}.`;
  const whyOthersWrong = Object.entries(question.choices)
    .filter(([key]) => key !== question.correct)
    .map(([key, value]) => `${key} is less appropriate here (${value}).`);

  return {
    isCorrect,
    feedbackJson: {
      why_correct: whyCorrect,
      why_others_wrong: whyOthersWrong,
      registry_priority: "Treat what kills fastest first: ABCs + unstable findings + transport decision."
    },
    thinkingErrors: isCorrect ? [] : question.thinking_errors_if_wrong
  };
}
