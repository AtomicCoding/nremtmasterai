export type Question = {
  id: string;
  stem: string;
  choices: Record<"A" | "B" | "C" | "D", string>;
  correct: "A" | "B" | "C" | "D";
  topic_tags: string[];
  difficulty: number;
  thinking_errors_if_wrong: string[];
};

export const questionBank: Question[] = [
  {
    id: "q_001",
    stem: "A 56-year-old with crushing chest pain is pale and diaphoretic. What is your first priority?",
    choices: { A: "Obtain detailed past history", B: "Assess airway, breathing, circulation", C: "Give oral glucose", D: "Delay transport for full exam" },
    correct: "B",
    topic_tags: ["cardio", "assessment"],
    difficulty: 2,
    thinking_errors_if_wrong: ["missed_unstable"]
  },
  {
    id: "q_002",
    stem: "Child with severe respiratory distress, SpO2 84% on room air. Best next action?",
    choices: { A: "Immediate oxygenation and ventilatory support", B: "Wait for nebulizer only", C: "Collect insurance card", D: "Give aspirin" },
    correct: "A",
    topic_tags: ["airway", "pedi"],
    difficulty: 3,
    thinking_errors_if_wrong: ["airway_delay"]
  },
  {
    id: "q_003",
    stem: "Pregnant trauma patient at 32 weeks with hypotension after MVC. Priority?",
    choices: { A: "Supine position and delay transport", B: "Left lateral tilt and rapid transport", C: "Only splint minor injuries", D: "Refuse transport" },
    correct: "B",
    topic_tags: ["trauma", "OB"],
    difficulty: 4,
    thinking_errors_if_wrong: ["transport_delay"]
  },
  {
    id: "q_004",
    stem: "Patient with altered mental status and pinpoint pupils. Most likely emergency pattern?",
    choices: { A: "Opioid toxidrome with respiratory depression", B: "Heat stroke", C: "Anaphylaxis", D: "Stroke mimic only" },
    correct: "A",
    topic_tags: ["medical", "assessment"],
    difficulty: 2,
    thinking_errors_if_wrong: ["missed_unstable"]
  },
  {
    id: "q_005",
    stem: "Pulseless adult, shockable rhythm on AED. Correct sequence?",
    choices: { A: "Pulse check for 2 minutes before shock", B: "Immediate shock then resume CPR", C: "Transport first", D: "Only airway" },
    correct: "B",
    topic_tags: ["cardio"],
    difficulty: 3,
    thinking_errors_if_wrong: ["protocol_break"]
  },
  {
    id: "q_006",
    stem: "Severe external hemorrhage from leg laceration not controlled by pressure. Next step?",
    choices: { A: "Tourniquet application", B: "Wait and watch", C: "Ice only", D: "Nothing until ER" },
    correct: "A",
    topic_tags: ["trauma"],
    difficulty: 2,
    thinking_errors_if_wrong: ["bleeding_delay"]
  },
  {
    id: "q_007",
    stem: "Wheezing patient can only speak one-word sentences. Best immediate management?",
    choices: { A: "Rapid bronchodilator/oxygen support", B: "No treatment needed", C: "Only transport with no intervention", D: "Sedate patient" },
    correct: "A",
    topic_tags: ["airway", "medical"],
    difficulty: 3,
    thinking_errors_if_wrong: ["airway_delay"]
  },
  {
    id: "q_008",
    stem: "Infant with poor perfusion and delayed cap refill after vomiting/diarrhea. Most concerning issue?",
    choices: { A: "Mild anxiety", B: "Potential hypovolemic shock", C: "Dental pain", D: "Simple rash" },
    correct: "B",
    topic_tags: ["pedi", "medical"],
    difficulty: 3,
    thinking_errors_if_wrong: ["missed_unstable"]
  },
  {
    id: "q_009",
    stem: "Elderly stroke patient onset 20 min ago, airway intact. Priority destination strategy?",
    choices: { A: "Nearest facility regardless", B: "Stroke-capable center with prenotification", C: "Home observation", D: "Delay for detailed neuro testing" },
    correct: "B",
    topic_tags: ["neuro", "transport"],
    difficulty: 2,
    thinking_errors_if_wrong: ["transport_delay"]
  },
  {
    id: "q_010",
    stem: "Unstable tachycardia with hypotension and chest pain. Appropriate EMT-level focus?",
    choices: { A: "Immediate supportive care and rapid transport", B: "Delay for oral meds", C: "Ignore hypotension", D: "Only reassess in 30 min" },
    correct: "A",
    topic_tags: ["cardio", "transport"],
    difficulty: 4,
    thinking_errors_if_wrong: ["missed_unstable"]
  }
];

export function getRandomQuestion(): Question {
  return questionBank[Math.floor(Math.random() * questionBank.length)];
}
