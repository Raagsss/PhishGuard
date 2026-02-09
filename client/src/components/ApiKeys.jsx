import { useEffect, useState } from 'react';
import axios from 'axios';
import { Key, Plus } from 'lucide-react';

export default function ApiKeys({ user }) {
  const [keys, setKeys] = useState([]);
  const [latestKey, setLatestKey] = useState(null);

  const loadKeys = async () => {
    if (!user) return;
    try {
      const response = await axios.get('/api/keys', { withCredentials: true });
      setKeys(response.data.keys || []);
    } catch (error) {
      console.error('Failed to load keys', error);
    }
  };

  useEffect(() => {
    loadKeys();
  }, [user]);

  const createKey = async () => {
    try {
      const response = await axios.post(
        '/api/keys',
        { name: `Key ${keys.length + 1}` },
        { withCredentials: true }
      );
      setLatestKey(response.data.key);
      loadKeys();
    } catch (error) {
      console.error('Failed to create key', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="glass p-6 rounded-2xl border border-white/10 mb-16">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">API Keys</h3>
          <p className="text-gray-400 text-sm">Use these keys to access the API</p>
        </div>
        <button
          onClick={createKey}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Key</span>
        </button>
      </div>

      {latestKey && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 text-emerald-200 text-xs mb-4">
          New key: <span className="font-mono">{latestKey}</span>
        </div>
      )}

      <div className="space-y-2">
        {keys.length === 0 ? (
          <p className="text-gray-400 text-sm">No keys created yet.</p>
        ) : (
          keys.map((key) => (
            <div key={key.id} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
              <Key className="w-4 h-4 text-purple-300" />
              <div>
                <p className="text-white text-sm">{key.name}</p>
                <p className="text-gray-400 text-xs">
                  Created {new Date(key.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
