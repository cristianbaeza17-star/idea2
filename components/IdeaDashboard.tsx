
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { Idea } from '../types';
import type { Session } from '@supabase/supabase-js';

interface IdeaDashboardProps {
  session: Session;
}

const IdeaDashboard: React.FC<IdeaDashboardProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getIdeas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!session?.user) throw new Error('¡No hay usuario en la sesión!');

      const { data, error, status } = await supabase
        .from('ideas')
        .select(`id, content, created_at`)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setIdeas(data as Idea[]);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getIdeas();
  }, [getIdeas]);

  const handleAddIdea = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newIdeaContent.trim()) return;

    try {
      setFormLoading(true);
      setError(null);
      const { user } = session;

      const { error } = await supabase
        .from('ideas')
        .insert([{ content: newIdeaContent, user_id: user.id }]);

      if (error) {
        throw error;
      }
      setNewIdeaContent('');
      await getIdeas();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Tus Ideas</h1>
          <p className="text-gray-400 text-sm break-all">Bienvenido, {session.user.email}</p>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      <form onSubmit={handleAddIdea} className="space-y-4">
        <textarea
          className="w-full px-4 py-3 text-lg text-gray-100 bg-gray-700 border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          placeholder="¿Qué idea brillante tienes hoy?"
          value={newIdeaContent}
          onChange={(e) => setNewIdeaContent(e.target.value)}
          rows={4}
          disabled={formLoading}
        />
        <button
          type="submit"
          className="w-full px-6 py-3 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-500/50 disabled:cursor-not-allowed transition-colors"
          disabled={formLoading || !newIdeaContent.trim()}
        >
          {formLoading ? 'Guardando...' : 'Guardar Idea'}
        </button>
      </form>

      {error && <div className="p-3 text-center text-red-300 bg-red-900/50 rounded-md">{error}</div>}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">Ideas Guardadas</h2>
        {loading ? (
          <p className="text-center text-gray-400 py-4">Cargando ideas...</p>
        ) : ideas.length === 0 ? (
          <div className="text-center text-gray-500 p-6 bg-gray-900/50 rounded-md">
            <p>Aún no has guardado ninguna idea.</p>
            <p>¡Empieza ahora!</p>
          </div>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {ideas.map((idea) => (
              <li key={idea.id} className="p-4 bg-gray-700/50 rounded-lg shadow animate-fade-in">
                <p className="text-gray-200 whitespace-pre-wrap">{idea.content}</p>
                <p className="text-xs text-right text-gray-500 mt-2">
                  {new Date(idea.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IdeaDashboard;
