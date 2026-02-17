import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { playerService } from '../../services/playerService';
import { X, Maximize2, Minimize2, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

export const MediaViewerScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { players, updatePlayerState } = useGlobalState();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [captionInput, setCaptionInput] = useState('');
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const allMedia = useMemo(() => {
    const list: Array<{ id: string; type: 'photo' | 'highlight'; src: string; title: string; date?: string }> = [];
    players.forEach(p => {
      (p.photos || []).forEach(ph => {
        if (ph?.id && ph?.url) {
          list.push({ id: ph.id, type: 'photo', src: ph.url, title: ph.caption || 'Photo', date: ph.date });
        }
      });
      (p.highlights || []).forEach(h => {
        if (h?.id && h?.thumbnail) {
          list.push({ id: h.id, type: 'highlight', src: h.thumbnail, title: h.title || 'Highlight', date: h.date });
        }
      });
    });
    return list;
  }, [players]);
  const index = useMemo(() => allMedia.findIndex(m => m.id === id), [allMedia, id]);
  const item = index >= 0 ? allMedia[index] : null;
  const prev = useCallback(() => {
    if (index > 0) {
      navigate(`/media/${allMedia[index - 1].id}`);
    }
  }, [index, allMedia, navigate]);
  const next = useCallback(() => {
    if (index < allMedia.length - 1) {
      navigate(`/media/${allMedia[index + 1].id}`);
    }
  }, [index, allMedia, navigate]);
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  }, []);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied');
    } catch {
      alert('Failed to copy link');
    }
  };
  const beginEdit = useCallback(() => {
    if (!item || item.type !== 'photo') return;
    setCaptionInput(item.title || '');
    setIsEditing(true);
  }, [item]);
  const saveCaption = async () => {
    if (!item || item.type !== 'photo') return;
    const owner = players.find(p => (p.photos || []).some(ph => ph.id === item.id));
    if (!owner) {
      setIsEditing(false);
      return;
    }
    const updatedPhotos = (owner.photos || []).map(ph => ph.id === item.id ? { ...ph, caption: captionInput } : ph);
    try {
      const updatedPlayer = await playerService.updatePlayer(owner.id, { photos: updatedPhotos });
      updatePlayerState(updatedPlayer);
      setIsEditing(false);
    } catch {
      alert('Failed to save caption');
    }
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setCaptionInput('');
  };
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = e => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    touchDelta.current = { x: 0, y: 0 };
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = e => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    touchDelta.current = { x: t.clientX - touchStart.current.x, y: t.clientY - touchStart.current.y };
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    const dx = touchDelta.current.x;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStart.current = null;
    touchDelta.current = { x: 0, y: 0 };
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate(-1);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
      if (e.key.toLowerCase() === 'e') beginEdit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, index, prev, next, toggleFullscreen, beginEdit]);
  if (!item) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
          <p className="text-slate-900 font-bold">Media not found</p>
          <button
            type="button"
            onClick={() => navigate('/profile/game')}
            className="mt-4 px-4 py-2 rounded-full bg-blue-600 text-white font-bold"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Media Viewer"
      className="min-h-screen w-full bg-black flex flex-col"
    >
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={share}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
      <div
        className="flex-1 flex items-center justify-center relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {item.type === 'photo' ? (
          <img src={item.src} alt={item.title} className="max-h-[80vh] max-w-[90vw] object-contain" />
        ) : (
          <video src={item.src} controls className="max-h-[80vh] max-w-[90vw] object-contain" />
        )}
        <button
          type="button"
          onClick={prev}
          disabled={index <= 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-40"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={next}
          disabled={index >= allMedia.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-40"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="p-4 bg-black/60 text-white">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              value={captionInput}
              onChange={e => setCaptionInput(e.target.value.slice(0, 60))}
              className="flex-1 bg-white/10 text-white text-sm px-2 py-1 rounded border border-white/20"
              aria-label="Caption"
            />
            <button
              type="button"
              onClick={saveCaption}
              className="px-3 py-1 rounded bg-green-600 text-white text-sm font-bold"
              aria-label="Save caption"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-3 py-1 rounded bg-slate-600 text-white text-sm font-bold"
              aria-label="Cancel edit"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <p className="text-lg font-bold">{item.title}</p>
              {item.type === 'photo' && (
                <button
                  type="button"
                  onClick={beginEdit}
                  className="text-white/80 hover:text-white text-sm underline"
                  aria-label="Edit caption"
                >
                  Edit
                </button>
              )}
            </div>
            {item.date && <p className="text-sm text-white/70">{item.date}</p>}
          </>
        )}
      </div>
    </div>
  );
};
