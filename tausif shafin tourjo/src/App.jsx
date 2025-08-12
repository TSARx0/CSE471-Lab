import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import './index.css'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
// Initialize Supabase client
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('app is running')



function App() {
  const [notes, setNotes] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes in authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Fetch notes only if the user is logged in
  useEffect(() => {
    if (session) {
      getNotes();
    }
  }, [session]);

  async function getNotes() {
    const { data, error } = await supabase
      .from("notes") 
      .select("content"); 

    if (error) {
  } else {
    console.log("Fetched notes:", data); 
    setNotes(data);
  }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return (
      <div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    );
  }

  return (
    <div>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note.content}</li>
        ))}
      </ul>
      <h1>hello from app.js, updated</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default App;

