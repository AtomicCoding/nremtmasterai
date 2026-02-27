import { createClient } from "@/lib/supabase/server";
import { calculateDashboard } from "@/lib/scoring/dashboard";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: attempts } = await supabase
    .from("attempts")
    .select("created_at,is_correct,difficulty,topic_tags,thinking_errors")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const metrics = calculateDashboard(attempts ?? []);

  return (
    <div>
      <div className="card">
        <h1>Dashboard</h1>
        <p><strong>Preparedness score:</strong> {metrics.score}/100</p>
        <p><strong>Trend vs prior window:</strong> {metrics.trend >= 0 ? `+${metrics.trend}` : metrics.trend}</p>
        <p className="small">Recent 30 attempts trend: {metrics.trendLast30.join(", ") || "No attempts yet"}</p>
      </div>

      <div className="card">
        <h2>Strength topics</h2>
        <ul>
          {metrics.strengths.length ? metrics.strengths.map((item) => <li key={item.topic}>{item.topic} ({Math.round(item.accuracy * 100)}% over {item.count})</li>) : <li>Not enough data yet (need at least 5 attempts/topic).</li>}
        </ul>
      </div>

      <div className="card">
        <h2>Weakness topics</h2>
        <ul>
          {metrics.weaknesses.length ? metrics.weaknesses.map((item) => <li key={item.topic}>{item.topic} ({Math.round(item.accuracy * 100)}% over {item.count})</li>) : <li>Not enough data yet (need at least 5 attempts/topic).</li>}
        </ul>
      </div>

      <div className="card">
        <h2>Most common thinking errors</h2>
        <ul>
          {metrics.topThinkingErrors.length ? metrics.topThinkingErrors.map((item) => <li key={item.error}>{item.error}: {item.count}</li>) : <li>No errors logged yet.</li>}
        </ul>
      </div>
    </div>
  );
}
