import { Github, LogOut, User } from 'lucide-react';

export default function AuthBar({ user }) {
  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <a
          href="http://localhost:5000/auth/google"
          className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
        >
          Sign in with Google
        </a>
        <a
          href="http://localhost:5000/auth/github"
          className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors flex items-center space-x-2"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
        {user.avatar ? (
          <img src={user.avatar} alt="user" className="w-6 h-6 rounded-full" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
        <span className="text-white text-sm">{user.name || 'User'}</span>
      </div>
      <a
        href="http://localhost:5000/auth/logout"
        className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </a>
    </div>
  );
}
