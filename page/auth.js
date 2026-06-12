import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMsg(error.message);
    else setMsg('Email envoyé — vérifiez votre boîte (magic link).');
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Connexion</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Envoyer le lien</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}