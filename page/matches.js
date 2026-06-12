import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    fetchMatches();
  }, []);

  async function fetchMatches() {
    const { data, error } = await supabase.from('matches').select('*').order('start_time', { ascending: true });
    if (error) console.error(error);
    else setMatches(data);
  }

  async function submitPrediction(matchId, home, away) {
    const userData = await supabase.auth.getUser();
    const userId = userData.data.user?.id;
    const { data, error } = await supabase.from('predictions').insert([{
      user_id: userId,
      match_id: matchId,
      pred_home: home,
      pred_away: away
    }]);
    if (error) alert('Erreur: ' + error.message);
    else {
      alert('Pronostic enregistré');
      fetchMatches();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Matches</h3>
      <Link href="/"><a>Accueil</a></Link>
      <ul>
        {matches.map(m => (
          <li key={m.id} style={{ margin: '12px 0', padding: 10, border: '1px solid #ddd' }}>
            <div><strong>{m.home_team}</strong> vs <strong>{m.away_team}</strong></div>
            <div>Début: {new Date(m.start_time).toLocaleString()}</div>
            <div>Status: {m.status}</div>
            <PredictionForm match={m} onSubmit={submitPrediction} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PredictionForm({ match, onSubmit }) {
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');

  function handle(e) {
    e.preventDefault();
    if (home === '' || away === '') return alert('Remplir les scores');
    onSubmit(match.id, parseInt(home, 10), parseInt(away, 10));
  }

  return (
    <form onSubmit={handle} style={{ marginTop: 8 }}>
      <input type="number" placeholder="Home" value={home} onChange={e => setHome(e.target.value)} min="0" style={{ width: 70 }} />
      <input type="number" placeholder="Away" value={away} onChange={e => setAway(e.target.value)} min="0" style={{ width: 70, marginLeft: 8 }} />
      <button type="submit" style={{ marginLeft: 8 }}>Envoyer</button>
    </form>
  );
}