import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Trophy, Calendar, Upload, Image as ImageIcon } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { Tournament } from '../../domain/tournament';

export const CreateTournamentScreen: React.FC = () => {
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [searchParams] = useSearchParams();
  const editTournamentId = searchParams.get('edit');
  const isEditMode = Boolean(editTournamentId);
  
  const { currentUser, addTournament, updateTournament, tournaments, matches } = useGlobalState();

  // Route Protection
  useEffect(() => {
    requireAuth(currentUser);
  }, [currentUser, requireAuth]);

  // Step 1 State: Identity
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [ground, setGround] = useState('');

  // Step 2 State: Dates
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Step 3 State: Category
  const [category, setCategory] = useState('');

  // Step 4 State: Playing Conditions
  const [ballType, setBallType] = useState('');
  const [pitchType, setPitchType] = useState('');
  const [matchType, setMatchType] = useState('');

  // Step 5 State: Requirements
  const [needsMoreTeams, setNeedsMoreTeams] = useState(false);
  const [needsOfficials, setNeedsOfficials] = useState(false);

  // Step 6 State: Branding
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isBannerDragActive, setIsBannerDragActive] = useState(false);
  const [isLogoDragActive, setIsLogoDragActive] = useState(false);

  // View State: 'form' | 'review'
  const [view, setView] = useState<'form' | 'review'>('form');

  // Check if matches exist (to lock structural fields)
  const hasMatches = isEditMode ? matches.some(m => m.tournamentId === editTournamentId) : false;

  const CATEGORY_OPTIONS = [
    'OPEN', 'CORPORATE', 'COMMUNITY', 'SCHOOL', 
    'COLLEGE', 'UNIVERSITY', 'SERIES', 'OTHER'
  ];

  const BALL_TYPE_OPTIONS = [
    { label: 'Tennis', value: 'TENNIS' },
    { label: 'Leather', value: 'LEATHER' },
    { label: 'Other', value: 'OTHER' }
  ];

  const PITCH_TYPE_OPTIONS = ['ROUGH', 'CEMENT', 'TURF', 'ASTROTURF', 'MATTING'];

  const MATCH_TYPE_OPTIONS = [
    { label: 'Limited Overs', value: 'LIMITED_OVERS' },
    { label: 'Box / Turf Cricket', value: 'BOX_TURF' },
    { label: 'Pair Cricket', value: 'PAIR_CRICKET' },
    { label: 'Test Match', value: 'TEST_MATCH' },
    { label: 'The Hundred', value: 'HUNDRED' }
  ];

  // Auto-fill city from user profile if available (only if not editing)
  useEffect(() => {
    if (!isEditMode && currentUser?.location && !city) {
      setCity(currentUser.location);
    }
  }, [currentUser, city, isEditMode]);

  // Load Tournament Data in Edit Mode
  useEffect(() => {
    if (!isEditMode || !editTournamentId) return;

    const tournament = tournaments.find(t => t.id === editTournamentId);
    if (!tournament) return;

    setName(tournament.name);
    setCity(tournament.location);
    setGround(tournament.ground || ''); // Use ground from extended interface or empty
    
    // Dates
    if (tournament.startDate) setStartDate(tournament.startDate);
    if (tournament.endDate) setEndDate(tournament.endDate);

    // Extra fields
    if (tournament.category) setCategory(tournament.category);
    if (tournament.ballType) setBallType(tournament.ballType);
    if (tournament.pitchType) setPitchType(tournament.pitchType);
    if (tournament.matchType) setMatchType(tournament.matchType);
    if (tournament.bannerUrl) setBannerUrl(tournament.bannerUrl);
    
    // If fields are missing (e.g. legacy data), we might want to default them or leave empty
    // Leaving them empty forces the user to select them, which is safer than guessing.
    
  }, [isEditMode, editTournamentId, tournaments]);

  // Validation
  const isIdentityValid = name.trim().length > 0 && city.trim().length > 0 && ground.trim().length > 0;
  const isDatesValid = startDate !== '' && endDate !== '' && endDate >= startDate;
  const isCategoryValid = category !== '';
  const isPlayingConditionsValid = ballType !== '' && matchType !== '';
  // Step 5 & 6 have no validation requirements (optional)
  const isFormValid = isIdentityValid && isDatesValid && isCategoryValid && isPlayingConditionsValid;

  // File Validation & Handling
  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPG, PNG, or GIF.');
      return false;
    }
    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit.');
      return false;
    }
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      const fakeUrl = URL.createObjectURL(file);
      setUrl(fakeUrl);
    }
  };

  const handleDrop = (e: React.DragEvent, setUrl: (url: string) => void, setDragActive: (active: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      const fakeUrl = URL.createObjectURL(file);
      setUrl(fakeUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent, setDragActive: (active: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent, setDragActive: (active: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleNext = () => {
    if (isFormValid) {
      if (view === 'form') {
        setView('review');
        window.scrollTo(0, 0);
      } else {
        if (!requireAuth(currentUser)) return;

        const commonData = {
          name,
          organizer: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Organizer',
          dates: `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          location: city,
          description: `${category} Tournament (${matchType})`,
          bannerUrl: bannerUrl || 'https://placehold.co/1200x300/1a237e/ffffff?text=Tournament',
          // Extended fields
          category,
          ballType,
          pitchType,
          matchType,
          ground,
          startDate,
          endDate,
        };

        if (isEditMode && editTournamentId) {
            // Update Existing
            const existingTournament = tournaments.find(t => t.id === editTournamentId);
            if (existingTournament) {
                const updatedTournament: Tournament = {
                    ...existingTournament,
                    ...commonData,
                    // Preserve ID and existing fields not covered by commonData
                };
                updateTournament(updatedTournament);
                navigate(`/tournament/${editTournamentId}`);
            }
        } else {
            // Create New
            const newTournament: Tournament = {
                id: Date.now().toString(),
                status: 'upcoming',
                ...commonData,
            };
            addTournament(newTournament);
            navigate('/');
        }
      }
    }
  };

  // Organiser Details (Read-only)
  const organiserName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User';
  const organiserPhone = currentUser?.phone || '+91 98765 43210'; // Fallback/Mock
  const organiserEmail = currentUser?.email || 'guest@example.com';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => view === 'review' ? setView('form') : navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-800">
            {view === 'review' ? 'Review Details' : (isEditMode ? 'Edit Tournament' : 'Add a tournament / series')}
          </h1>
        </div>
        
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all
            ${isFormValid 
              ? 'bg-teal-600 text-white shadow-md hover:bg-teal-700 active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
          `}
        >
          <span>{view === 'review' ? (isEditMode ? 'Update Tournament' : 'Create Tournament') : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
        
        {view === 'form' ? (
          <>
            {/* Step Indicator (Visual only for now) */}
        <div className="flex items-center gap-2 mb-6">
            <div className="h-1 flex-1 bg-teal-600 rounded-full"></div>
            <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
            <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            {/* Tournament Branding (Moved to Top) */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-800">
                    Tournament branding
                </h3>

                {/* Banner Upload */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tournament banner
                    </label>
                    <div 
                        className={`relative group w-full aspect-video rounded-xl border-2 border-dashed transition-all overflow-hidden
                            ${isBannerDragActive 
                                ? 'border-teal-500 bg-teal-50' 
                                : 'border-slate-200 bg-slate-50 hover:border-teal-400'
                            }
                        `}
                        onDragOver={(e) => handleDragOver(e, setIsBannerDragActive)}
                        onDragLeave={(e) => handleDragLeave(e, setIsBannerDragActive)}
                        onDrop={(e) => handleDrop(e, setBannerUrl, setIsBannerDragActive)}
                    >
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/gif"
                            onChange={(e) => handleFileSelect(e, setBannerUrl)}
                            className="hidden" 
                            id="banner-upload"
                            aria-label="Upload tournament banner"
                        />
                        
                        {bannerUrl ? (
                            <>
                                <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label 
                                        htmlFor="banner-upload"
                                        className="cursor-pointer flex items-center gap-2 text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>Change banner</span>
                                    </label>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                <span className="text-sm text-slate-400 mb-3">No file chosen</span>
                                <label 
                                    htmlFor="banner-upload"
                                    className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload banner (optional)
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tournament logo
                    </label>
                    <div 
                        className={`relative group w-32 h-32 rounded-xl border-2 border-dashed transition-all overflow-hidden
                            ${isLogoDragActive 
                                ? 'border-teal-500 bg-teal-50' 
                                : 'border-slate-200 bg-slate-50 hover:border-teal-400'
                            }
                        `}
                        onDragOver={(e) => handleDragOver(e, setIsLogoDragActive)}
                        onDragLeave={(e) => handleDragLeave(e, setIsLogoDragActive)}
                        onDrop={(e) => handleDrop(e, setLogoUrl, setIsLogoDragActive)}
                    >
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/gif"
                            onChange={(e) => handleFileSelect(e, setLogoUrl)}
                            className="hidden" 
                            id="logo-upload"
                            aria-label="Upload tournament logo"
                        />
                        
                        {logoUrl ? (
                            <>
                                <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label 
                                        htmlFor="logo-upload"
                                        className="cursor-pointer p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
                                        title="Change logo"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </label>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                                <span className="text-[10px] text-slate-400 mb-2">No file chosen</span>
                                <label 
                                    htmlFor="logo-upload"
                                    className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
                                >
                                    Upload logo
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100"></div>

            {/* 1. Tournament Name */}
            <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tournament / series name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hasiruvalli Panchayath Premier League"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
            </div>

            {/* 2. City */}
            <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    City <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
            </div>

            {/* 3. Ground */}
            <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ground <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={ground}
                    onChange={(e) => setGround(e.target.value)}
                    placeholder="e.g. Channigappa Ground"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
            </div>

            {/* 4. Organiser Details (Read-only) */}
            <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Organiser Details
                </h3>
                
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Name</span>
                        <span className="text-sm font-semibold text-slate-700">{organiserName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Number</span>
                        <span className="text-sm font-semibold text-slate-700">{organiserPhone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Email</span>
                        <span className="text-sm font-semibold text-slate-700">{organiserEmail}</span>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                    These details are auto-filled from your profile.
                </p>
            </div>

            {/* Step 2: Tournament Dates */}
            <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4">
                    Tournament dates
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Start Date */}
                    <div className="flex-1 space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Start date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* End Date */}
                    <div className="flex-1 space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            End date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate} // HTML5 validation constraint
                                className={`w-full p-3 bg-slate-50 border rounded-xl font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none
                                    ${endDate && startDate && endDate < startDate 
                                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                        : 'border-slate-200 focus:border-teal-500'}
                                `}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 3: Tournament Category */}
            <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3">
                    Tournament category <span className="text-red-500">*</span>
                </h3>
                {hasMatches && (
                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
                        Cannot change category after matches are created.
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map((option) => (
                        <button
                            key={option}
                            onClick={() => !hasMatches && setCategory(option)}
                            disabled={hasMatches}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border
                                ${category === option
                                    ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                                    : hasMatches 
                                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }
                            `}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 4: Playing Conditions */}
            <div className="pt-4 border-t border-slate-100 space-y-6">
                <h3 className="text-sm font-bold text-slate-800">
                    Playing conditions
                </h3>
                {hasMatches && (
                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
                        Cannot change conditions after matches are created.
                    </div>
                )}

                {/* Ball Type */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Select ball type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {BALL_TYPE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => !hasMatches && setBallType(option.value)}
                                disabled={hasMatches}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border
                                    ${ballType === option.value
                                        ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                                        : hasMatches
                                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pitch Type */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Pitch type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {PITCH_TYPE_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => !hasMatches && setPitchType(option)}
                                disabled={hasMatches}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border
                                    ${pitchType === option
                                        ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                                        : hasMatches
                                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }
                                `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Match Type */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Match type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {MATCH_TYPE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => !hasMatches && setMatchType(option.value)}
                                disabled={hasMatches}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border
                                    ${matchType === option.value
                                        ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                                        : hasMatches
                                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step 5: Requirements */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-800">
                    Requirements
                </h3>
                
                {/* Need More Teams */}
                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input 
                        type="checkbox"
                        checked={needsMoreTeams}
                        onChange={(e) => setNeedsMoreTeams(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Do you need more teams for your tournament?</span>
                </label>

                {/* Need Officials */}
                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input 
                        type="checkbox"
                        checked={needsOfficials}
                        onChange={(e) => setNeedsOfficials(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Do you need officials? (e.g. Umpire, Scorer)</span>
                </label>
            </div>

            {/* Branding Section moved to top */}
        </div>
        </>
        ) : (
          <div className="space-y-6">
             {/* Review UI Implementation */}
             {/* Banner Preview */}
             {bannerUrl && (
                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                   <img src={bannerUrl} alt="Tournament Banner" className="w-full h-full object-cover" />
                </div>
             )}

             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                   {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-white shadow-sm" />
                   ) : (
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                         {name.charAt(0)}
                      </div>
                   )}
                   <div>
                      <h2 className="font-bold text-slate-800">{name}</h2>
                      <p className="text-xs text-slate-500">{city} • {ground}</p>
                   </div>
                </div>
                
                <div className="p-4 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-xs font-bold text-slate-400 uppercase">Dates</label>
                         <p className="text-sm font-medium text-slate-700">{startDate} - {endDate}</p>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                         <p className="text-sm font-medium text-slate-700">{category}</p>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Conditions</label>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{ballType}</span>
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{matchType}</span>
                        {pitchType && <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{pitchType}</span>}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
