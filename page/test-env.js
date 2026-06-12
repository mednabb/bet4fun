export default function TestEnv() {
  return (
    <div>
      <div>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</div>
      <div>KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'missing'}</div>
    </div>
  );
}