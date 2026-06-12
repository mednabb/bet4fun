import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>WC26 Pronostics — Communauté</h3>
      {user ? (
        <div>
          <p>Connecté: {user.email}</p>
          <button onClick={signOut}>Se déconnecter</button>
        </div>
      ) : (
        <div>
          <Link href="/auth"><a>Se connecter / S'inscrire</a></Link>
        </div>
      )}
      <nav style={{ marginTop: 20 }}>
        <Link href="/matches"><a>Matches</a></Link> |{' '}
        <Link href="/leaderboard"><a>Classement</a></Link>
      </nav>
    </div>
  );
}