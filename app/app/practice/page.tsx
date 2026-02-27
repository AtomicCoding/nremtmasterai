import { PracticeDrill } from "@/components/practice-drill";
import { getRandomQuestion } from "@/lib/questions/bank";

export default function PracticePage() {
  const question = getRandomQuestion();
  return <PracticeDrill question={question} />;
}
