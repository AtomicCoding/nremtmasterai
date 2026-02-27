"use client";

import { useState } from "react";
import type { Question } from "@/lib/questions/bank";

type Props = { question: Question };

export function PracticeDrill({ question }: Props) {
  const [choice, setChoice] = useState<"A" | "B" | "C" | "D" | "">("");
  const [result, setResult] = useState<{ is_correct: boolean; feedback_json: { why_correct: string; why_others_wrong: string[]; registry_priority: string } } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submitAnswer() {
    if (!choice) return;
    setMessage(null);
    const response = await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, selected_choice: choice })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Failed to save attempt");
      return;
    }
    setResult(data);
  }

  return (
    <div className="card">
      <h1>Practice Drill</h1>
      <p>{question.stem}</p>
      {(["A", "B", "C", "D"] as const).map((key) => (
        <label key={key} style={{ display: "block", marginBottom: 8 }}>
          <input type="radio" name="choice" checked={choice === key} onChange={() => setChoice(key)} /> {key}. {question.choices[key]}
        </label>
      ))}
      <button onClick={submitAnswer} disabled={!choice}>Submit</button>
      {message ? <p className="small">{message}</p> : null}
      {result ? (
        <div className="card">
          <h3>{result.is_correct ? "Correct" : "Incorrect"}</h3>
          <p>{result.feedback_json.why_correct}</p>
          <ul>{result.feedback_json.why_others_wrong.map((item) => <li key={item}>{item}</li>)}</ul>
          <p><strong>Registry priority:</strong> {result.feedback_json.registry_priority}</p>
        </div>
      ) : null}
    </div>
  );
}
