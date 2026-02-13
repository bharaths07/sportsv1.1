import React, { useState, useRef, useEffect } from 'react';
import { Image, Upload, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { useGlobalState } from '../../../app/AppProviders';
import { playerService } from '../../../services/playerService';

export const GameProfilePhotos: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useFileUpload();
  const { currentUser, players, updatePlayerState } = useGlobalState();
  
  // Find current player
  const player = players.find(p => p.userId === currentUser?.id);
  
  // Initialize with persisted photos or empty array
  const [photos, setPhotos] = useState<any[]>(player?.photos || []);

  // Sync with player data when it changes
  useEffect(() => {
    if (player?.photos) {
      setPhotos(player.photos);
    }
  }, [player]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && player) {
      const file = e.target.files[0];
      
      const { url, error } = await uploadFile(file, 'player-photos');
      
      if (url) {
        // Add new photo to list
        const newPhoto = {
          id: Date.now().toString(),
          url: url,
          isUrl: true,
          caption: 'Uploaded Photo',
          date: new Date().toISOString().split('T')[0]
        };
        
        const updatedPhotos = [newPhoto, ...photos];
        setPhotos(updatedPhotos);
        
        // Persist to database
        try {
            const updatedPlayer = await playerService.updatePlayer(player.id, { photos: updatedPhotos });
            // Refresh global state to reflect changes elsewhere if needed
            updatePlayerState(updatedPlayer);
        } catch (err) {
            console.error("Failed to save photo metadata", err);
            // Optionally revert local state or show toast
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
        accept="image/*"
      />

      {/* Upload Action */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 text-lg">Photo Gallery</h3>
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
                <span>Upload</span>
              </>
          )}
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Add New Placeholder */}
        <div 
            onClick={triggerUpload}
            className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
        >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <Plus size={20} />
            </div>
            <span className="text-xs font-bold">Add Photo</span>
        </div>

        {/* Photos */}
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            onClick={() => navigate(`/media/${photo.id}`)}
            className="aspect-square relative group overflow-hidden rounded-xl cursor-pointer"
          >
            {photo.isUrl ? (
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
                <div className={`w-full h-full ${photo.url} bg-cover bg-center transition-transform duration-500 group-hover:scale-110`}></div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-sm font-bold truncate">{photo.caption}</p>
                <p className="text-white/70 text-[10px]">{photo.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
