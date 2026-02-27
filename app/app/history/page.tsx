import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: attempts } = await supabase
    .from("attempts")
    .select("id,created_at,selected_choice,is_correct,topic_tags,difficulty,thinking_errors")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="card">
      <h1>Attempt History</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Correct</th>
            <th>Choice</th>
            <th>Topics</th>
            <th>Difficulty</th>
            <th>Thinking errors</th>
          </tr>
        </thead>
        <tbody>
          {(attempts ?? []).map((attempt) => (
            <tr key={attempt.id}>
              <td>{new Date(attempt.created_at).toLocaleString()}</td>
              <td>{attempt.is_correct ? "Yes" : "No"}</td>
              <td>{attempt.selected_choice}</td>
              <td>{attempt.topic_tags.join(", ")}</td>
              <td>{attempt.difficulty}</td>
              <td>{attempt.thinking_errors.join(", ") || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
