import React, { useState } from 'react';
import { User, Mail, Lock, Calendar, Heart, Shield, Upload, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { UserProfile, FavoritePerson, Gender } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  favoritePerson: FavoritePerson;
  onSaveProfile: (user: UserProfile, fav: FavoritePerson) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  favoritePerson,
  onSaveProfile,
  isLoggedIn,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'profile' | 'login' | 'signup'>(isLoggedIn ? 'profile' : 'login');
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password || 'Password@123');
  const [gender, setGender] = useState<Gender>(user.gender);
  const [age, setAge] = useState<number>(user.age);
  const [dob, setDob] = useState(user.dob);

  // Case tracking state
  const [hasCase, setHasCase] = useState(user.hasCase);
  const [cnrNumber, setCnrNumber] = useState(user.cnrNumber || '');
  const [caseTitle, setCaseTitle] = useState(user.caseTitle || '');
  const [caseType, setCaseType] = useState(user.caseType || 'Civil Writ Petition');
  const [courtName, setCourtName] = useState(user.courtName || 'High Court of Judicature');
  const [caseComplexity, setCaseComplexity] = useState<'normal' | 'moderate' | 'complicated'>(
    user.caseComplexity || 'complicated'
  );

  // Favorite Person state
  const [favName, setFavName] = useState(favoritePerson.name);
  const [favRelation, setFavRelation] = useState(favoritePerson.relation);
  const [favNickname, setFavNickname] = useState(favoritePerson.nickname);
  const [favCallMeAs, setFavCallMeAs] = useState(favoritePerson.callMeAs || 'Nanna');
  const [favPhoto, setFavPhoto] = useState(favoritePerson.photoUrl);
  const [favTone, setFavTone] = useState(favoritePerson.personaTone);
  const [favAvatarEnabled, setFavAvatarEnabled] = useState(favoritePerson.isAvatarEnabled);

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFavPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      ...user,
      name: name.trim() || 'Valued User',
      email: email.trim(),
      password,
      gender,
      age: Number(age) || 24,
      dob,
      hasCase,
      cnrNumber: hasCase ? cnrNumber.trim() : undefined,
      caseTitle: hasCase ? caseTitle.trim() : undefined,
      caseType: hasCase ? caseType.trim() : undefined,
      courtName: hasCase ? courtName.trim() : undefined,
      caseComplexity: hasCase ? caseComplexity : undefined,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    const updatedFav: FavoritePerson = {
      name: favName.trim() || 'Amma (Mother)',
      relation: favRelation || 'Mother',
      nickname: favNickname.trim() || 'Amma',
      callMeAs: favCallMeAs.trim() || 'Nanna',
      photoUrl: favPhoto,
      personaTone: favTone,
      isAvatarEnabled: favAvatarEnabled,
    };

    onSaveProfile(updatedUser, updatedFav);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              {isLoggedIn ? 'User Account & Emotional Profile' : mode === 'login' ? 'Sign In with Gmail' : 'Create Cure Connect Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized mental health companion, CNR case guardian, and safety network profile.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Core Credentials & Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-teal-400 flex items-center gap-2">
              <User className="w-4 h-4" /> 1. User Identity & Gmail Login
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fareed Mahammad"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gmail Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Gender selector: boy, girl, other */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['boy', 'girl', 'other'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                        gender === g
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {g === 'boy' ? 'Boy (Male)' : g === 'girl' ? 'Girl (Female)' : 'Others'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  min={10}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth (DOB)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Court / CNR Case Tracking Details */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <Shield className="w-4 h-4" /> 2. CNR Legal Case Tracking (Stress Mitigation)
              </h3>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCase}
                  onChange={(e) => setHasCase(e.target.checked)}
                  className="rounded border-slate-700 text-teal-500 focus:ring-teal-400"
                />
                Track Active Legal Case
              </label>
            </div>

            {hasCase ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-amber-500/20">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">CNR Number (16 Digits/ID)</label>
                  <input
                    type="text"
                    value={cnrNumber}
                    onChange={(e) => setCnrNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. DLHC010048222025"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-amber-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Case Type</label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Civil Writ Petition">Civil Writ Petition</option>
                    <option value="Property / Title Dispute">Property / Title Dispute</option>
                    <option value="Consumer Grievance / Appeal">Consumer Grievance / Appeal</option>
                    <option value="Family / Guardianship Matter">Family / Guardianship Matter</option>
                    <option value="Commercial Arbitration">Commercial Arbitration</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Case Complexity / Pressure Level</label>
                  <select
                    value={caseComplexity}
                    onChange={(e) => setCaseComplexity(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="normal">Normal Listing (Standard judicial schedule)</option>
                    <option value="moderate">Moderate Complexity (Pleadings & Contested rejoinder)</option>
                    <option value="complicated">Complicated / Severe (High litigation stress — provides nearby Rehabilitation Centers & Counseling)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Case Title / Details</label>
                  <input
                    type="text"
                    value={caseTitle}
                    onChange={(e) => setCaseTitle(e.target.value)}
                    placeholder="e.g. Mahammad v. State Property Registry & Civil Relief"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No active case tracked. Toggle above if you wish the AI to track hearing dates and provide daily legal anxiety reassurance.
              </p>
            )}
          </div>

          {/* Section 3: Favorite Person Photo & Persona */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> 3. Favorite Person (Photo & Real Person Avatar Conversion)
                </h3>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFavName('Amma (Mother)');
                      setFavRelation('Mother');
                      setFavNickname('Amma');
                      setFavCallMeAs('Nanna');
                      setFavTone('Warm & Affectionate');
                    }}
                    className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-600/40 text-rose-300 hover:bg-rose-900"
                  >
                    Amma (calls me Nanna)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFavName('Maya Lin');
                      setFavRelation('Best Friend');
                      setFavNickname('May');
                      setFavCallMeAs('Buddy');
                      setFavTone('Playful & Cheerful');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  >
                    Best Friend (calls me Buddy)
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Upload your favorite person's photo: the 3D Video Call Avatar dynamically converts into their face, and the AI speaks to you using the exact loving name they call you (e.g., Amma calling you <em>Nanna</em>).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              {/* Photo Upload Area */}
              <div className="sm:col-span-1 flex flex-col items-center">
                <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-rose-500/40 hover:border-rose-400 overflow-hidden bg-slate-950 flex items-center justify-center group cursor-pointer shadow-lg">
                  {favPhoto ? (
                    <img src={favPhoto} alt={favName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <Upload className="w-6 h-6 text-rose-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-400 font-semibold">Upload Photo</span>
                      <span className="text-[9px] text-rose-400/80 block">Converts 3D Avatar</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {favPhoto ? (
                  <button
                    type="button"
                    onClick={() => setFavPhoto('')}
                    className="text-[11px] text-rose-400 hover:underline mt-1"
                  >
                    Remove Photo
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 text-center mt-1">
                    Converts Avatar to Real Person
                  </span>
                )}
              </div>

              {/* Persona Fields */}
              <div className="sm:col-span-2 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Favorite Person Name</label>
                    <input
                      type="text"
                      value={favName}
                      onChange={(e) => setFavName(e.target.value)}
                      placeholder="e.g. Amma / Maya / Dad"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Relationship</label>
                    <select
                      value={favRelation}
                      onChange={(e) => setFavRelation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-rose-500 focus:outline-none"
                    >
                      <option value="Mother">Mother (Amma / Mom)</option>
                      <option value="Father">Father (Nana / Dad)</option>
                      <option value="Best Friend">Best Friend</option>
                      <option value="Partner">Partner / Spouse</option>
                      <option value="Sibling">Sibling (Brother / Sister)</option>
                      <option value="Mentor">Mentor / Teacher</option>
                      <option value="Guardian">Guardian / Family Member</option>
                    </select>
                  </div>
                </div>

                {/* HOW THE FAVORITE PERSON CALLS YOU */}
                <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-rose-300">
                    How does {favName || 'this person'} call you? (Loving Endearment)
                  </label>
                  <p className="text-[11px] text-slate-400">
                    e.g., Amma will call her son <strong className="text-white">"Nanna"</strong> or <strong className="text-white">"Kanna"</strong> or <strong className="text-white">"Beta"</strong>. The AI will speak to you with this exact name!
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={favCallMeAs}
                      onChange={(e) => setFavCallMeAs(e.target.value)}
                      placeholder="e.g. Nanna / Kanna / Beta / Babu / Buddy"
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-rose-500/40 rounded-lg text-xs text-rose-100 font-semibold focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                  {/* Quick Endearment Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {['Nanna', 'Beta', 'Kanna', 'Babu', 'Sonny', 'Princess', 'Sweetheart', 'Buddy'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setFavCallMeAs(chip)}
                        className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                          favCallMeAs === chip
                            ? 'bg-rose-500 text-white font-bold'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Pet Name / Nickname</label>
                    <input
                      type="text"
                      value={favNickname}
                      onChange={(e) => setFavNickname(e.target.value)}
                      placeholder="e.g. Amma / May"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Persona Speaking Tone</label>
                    <select
                      value={favTone}
                      onChange={(e) => setFavTone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-rose-500 focus:outline-none"
                    >
                      <option value="Warm & Affectionate">Warm & Affectionate (Motherly / Loving)</option>
                      <option value="Playful & Cheerful">Playful & Cheerful</option>
                      <option value="Calm & Grounding">Calm & Grounding</option>
                      <option value="Empathetic & Protective">Empathetic & Protective</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={favAvatarEnabled}
                    onChange={(e) => setFavAvatarEnabled(e.target.checked)}
                    className="rounded border-slate-700 text-rose-500 focus:ring-rose-400"
                  />
                  <span>Convert 3D Video Call Avatar directly into {favName || 'Favorite Person'}'s Face</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-lg border border-rose-900/50 transition-colors"
              >
                Log Out
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors shadow-sm"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
