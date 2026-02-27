import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="card">
      <h1>NREMT Master AI</h1>
      <p>Simple NREMT drill app with subscription gating and readiness dashboard.</p>
      <p>
        <Link href="/signup"><button>Create account</button></Link>
      </p>
    </div>
  );
}
