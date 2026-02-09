import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Avatar } from '../../components/ui/Avatar';
import { ArrowLeft, Camera } from 'lucide-react';

export const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useGlobalState();

  // Guard: If no user, redirect to login or profile
  if (!currentUser) {
    // In a real app, might show a loading spinner or redirect
    return <div className="p-5 text-center text-text-secondary">Please log in to edit your profile.</div>;
  }

  const initialFirst = currentUser.firstName || (currentUser.name ? currentUser.name.split(' ')[0] : '');
  const initialLast = currentUser.lastName || (currentUser.name ? currentUser.name.split(' ').slice(1).join(' ') : '');

  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [location, setLocation] = useState(currentUser.location || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        firstName,
        lastName,
        location,
        bio,
        avatarUrl: avatarUrl || undefined // Don't save empty string
      });
      navigate(-1); // Go back
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Mock Avatar Change
  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    const mockAvatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    ];
    const random = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setAvatarUrl(random);
  };

  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
          className="text-text-secondary hover:text-text-primary -ml-2"
        >
          <ArrowLeft size={18} className="mr-1" />
          Cancel
        </Button>
        <h1 className="text-lg font-bold text-text-primary">
          Edit Profile
        </h1>
        <Button 
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="text-primary font-semibold hover:bg-primary/5 hover:text-primary -mr-2"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-lg mx-auto w-full">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
            <Avatar 
              src={avatarUrl} 
              fallback={`${firstName[0] || ''}${lastName[0] || ''}`}
              className="w-24 h-24 border-4 border-white shadow-sm"
            />
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white drop-shadow-md" size={24} />
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleAvatarChange}
            className="mt-3 text-primary"
          >
            Change Photo
          </Button>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </div>
            <div className="flex-1">
              <Input 
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
          </div>

          <Input 
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />

          <Textarea 
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
            helperText={`${bio.length} characters`}
          />

        </div>

      </div>
    </div>
  );
};
