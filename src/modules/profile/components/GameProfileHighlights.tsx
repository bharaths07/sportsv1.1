import React, { useState, useRef, useEffect } from 'react';
import { Play, Share2, Heart, MessageSquare, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { useGlobalState } from '../../../app/AppProviders';
import { playerService } from '../../../services/playerService';

export const GameProfileHighlights: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useFileUpload();
  const { currentUser, players, updatePlayerState } = useGlobalState();

  // Find current player
  const player = players.find(p => p.userId === currentUser?.id);

  // Initialize with persisted highlights or empty array
  const [highlights, setHighlights] = useState<any[]>(player?.highlights || []);

  // Sync with player data when it changes
  useEffect(() => {
    if (player?.highlights) {
      setHighlights(player.highlights);
    }
  }, [player]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && player) {
      const file = e.target.files[0];
      
      const { url, error } = await uploadFile(file, 'match-highlights');
      
      if (url) {
        // Add new highlight to list
        const newHighlight = {
          id: Date.now().toString(),
          title: 'New Highlight',
          game: 'Cricket',
          thumbnail: url, // Using the video/image URL as thumbnail for now
          isVideoUrl: true,
          views: '0',
          date: 'Just now',
          duration: '0:00'
        };
        
        const updatedHighlights = [newHighlight, ...highlights];
        setHighlights(updatedHighlights);

        // Persist to database
        try {
            const updatedPlayer = await playerService.updatePlayer(player.id, { highlights: updatedHighlights });
            updatePlayerState(updatedPlayer);
        } catch (err) {
            console.error("Failed to save highlight metadata", err);
        }

      } else {
        alert(`Upload failed: ${error}`);
      }
    } else if (!player) {
        alert("Player profile not found. Please ensure you are logged in.");
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
        accept="video/*,image/*"
      />

      {/* Upload Action */}
      <div className="flex justify-end">
        <button 
            type="button"
            onClick={triggerUpload}
            disabled={uploading}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
        >
          {uploading ? (
              <span className="animate-pulse">Uploading...</span>
          ) : (
              <>
                <Upload size={16} />
                <span>Add Highlight</span>
              </>
          )}
        </button>
      </div>

      {/* Highlights List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((item) => (
          <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group">
            {/* Thumbnail */}
            <div 
                onClick={() => navigate(`/media/${item.id}`)}
                className={`aspect-video ${!item.isVideoUrl ? item.thumbnail : 'bg-black'} relative flex items-center justify-center cursor-pointer`}
            >
               {item.isVideoUrl && (
                   <video src={item.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60" />
               )}
               <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform cursor-pointer z-10">
                  <Play size={20} fill="currentColor" />
               </div>
               <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                  {item.duration}
               </span>
            </div>
            
            {/* Content */}
            <div className="p-4">
               <div className="flex justify-between items-start mb-2">
                  <div>
                     <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                        {item.game}
                     </span>
                     <h3 className="font-bold text-slate-900 leading-tight">{item.title}</h3>
                  </div>
               </div>
               
               <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-50">
                  <span>{item.views} views • {item.date}</span>
                  <div className="flex gap-3">
                     <button onClick={() => navigate('/coming-soon')} className="hover:text-red-500 transition-colors"><Heart size={14} /></button>
                     <button onClick={() => navigate('/coming-soon')} className="hover:text-blue-500 transition-colors"><MessageSquare size={14} /></button>
                     <button onClick={() => navigate('/coming-soon')} className="hover:text-slate-900 transition-colors"><Share2 size={14} /></button>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
