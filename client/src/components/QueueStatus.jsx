import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function QueueStatus({ jobId, onComplete }) {
  const [status, setStatus] = useState('queued');

  useEffect(() => {
    if (!jobId) {
      return;
    }

    let isMounted = true;

    const poll = async () => {
      try {
        const response = await axios.get(`/api/scan/${jobId}`);
        const data = response.data;

        if (!isMounted) return;

        setStatus(data.status);
        if (data.status === 'completed' && data.result) {
          onComplete(data.result);
        }
      } catch (error) {
        console.error('Failed to fetch job status', error);
      }
    };

    const interval = setInterval(poll, 1200);
    poll();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [jobId, onComplete]);

  if (!jobId) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-purple-200">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Queue status: {status}</span>
    </div>
  );
}
