import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    const { data, error } = await supabase.from('leaderboard').select('*');
    if (error) console.error(error);
    else setRows(data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Classement</h3>
      <Link href="/"><a>Accueil</a></Link>
      <table style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>#</th><th>Email</th><th>Points</th><th>Nº pronos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.user_id}>
              <td>{i+1}</td>
              <td>{r.email}</td>
              <td>{r.total_points}</td>
              <td>{r.nb_predictions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}