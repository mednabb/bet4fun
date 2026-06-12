import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient' // adapte le chemin si différent

export default function TestSupabase() {
  const [matches, setMatches] = useState([])
  const [message, setMessage] = useState('')
  const [pred, setPred] = useState({ match_id: '', home_goals: 0, away_goals: 0 })

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('start_time', { ascending: true })
        .limit(10)
      if (error) setMessage('Erreur fetch: ' + error.message)
      else setMatches(data || [])
    }
    load()
  }, [])

  async function submitPrediction(e) {
    e.preventDefault()
    setMessage('Envoi...')
    const user = supabase.auth.user()
    if (!user) {
      setMessage('Pas connecté. Connecte-toi d’abord (page auth).')
      return
    }
    const { error } = await supabase
      .from('predictions')
      .insert([{
        match_id: pred.match_id,
        user_id: user.id,
        home_goals: Number(pred.home_goals),
        away_goals: Number(pred.away_goals)
      }])
    if (error) setMessage('Erreur insert: ' + error.message)
    else setMessage('Prediction enregistrée ✅')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Supabase</h2>
      <p>{message}</p>

      <h3>Matches (10 premiers)</h3>
      <ul>
        {matches.map(m => (
          <li key={m.id}>
            {m.home_team} vs {m.away_team} — {new Date(m.start_time).toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>Poster une prediction</h3>
      <form onSubmit={submitPrediction}>
        <label>
          Match (id) :
          <input value={pred.match_id} onChange={e => setPred({ ...pred, match_id: e.target.value })} />
        </label>
        <br />
        <label>
          Home goals:
          <input type="number" value={pred.home_goals} onChange={e => setPred({ ...pred, home_goals: e.target.value })} />
        </label>
        <br />
        <label>
          Away goals:
          <input type="number" value={pred.away_goals} onChange={e => setPred({ ...pred, away_goals: e.target.value })} />
        </label>
        <br />
        <button type="submit">Envoyer prediction</button>
      </form>
    </div>
  )
}