'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { AuthSession } from '../types';
import Auth from '../components/Auth';
import IdeaDashboard from '../components/IdeaDashboard';

export default function HomePage() {
  const [session, setSession] = useState<AuthSession>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white text-xl">Cargando...</div>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-2xl w-full">
        {!session ? <Auth /> : <IdeaDashboard key={session.user.id} session={session} />}
      </div>
    </main>
  );
}
