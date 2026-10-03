import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatSegment = (seg) => {
    return seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <nav className="flex items-center text-xs text-slate-500">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                {formatSegment(name)}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-800 transition-colors truncate max-w-[120px]">
                {formatSegment(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
