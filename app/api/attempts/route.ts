import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { gradeQuestion } from "@/lib/questions/grade";

const payloadSchema = z.object({
  question: z.object({
    id: z.string(),
    stem: z.string(),
    choices: z.record(z.string()),
    correct: z.enum(["A", "B", "C", "D"]),
    topic_tags: z.array(z.string()),
    difficulty: z.number().int().min(1).max(5),
    thinking_errors_if_wrong: z.array(z.string())
  }),
  selected_choice: z.enum(["A", "B", "C", "D"])
});

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { question, selected_choice } = parsed.data;
  const grade = gradeQuestion(question, selected_choice);

  const { error } = await supabase.from("attempts").insert({
    user_id: user.id,
    question_json: question,
    selected_choice,
    is_correct: grade.isCorrect,
    topic_tags: question.topic_tags,
    difficulty: question.difficulty,
    thinking_errors: grade.thinkingErrors,
    feedback_json: grade.feedbackJson,
    time_seconds: null
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ is_correct: grade.isCorrect, feedback_json: grade.feedbackJson });
}
