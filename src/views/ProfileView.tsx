import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Globe, Save, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [tier] = useState(user.tier);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Linguist Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">User Account & Persona</h1>
        <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
          Manage your account credentials, enterprise plan details, and linguistic profile.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#EAF5EC] border border-[#CDE5D2] text-[#287D3C] text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Profile information updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-[#F0ECE1] pb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C5A059] to-[#EBD7A0] flex items-center justify-center font-display text-xl font-bold text-[#2A200B] shadow-sm">
            HX
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1A1918]">{name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF4E6] text-[#8C6D23] text-[10px] font-bold uppercase tracking-wider border border-[#EEDBBA]">
                <ShieldCheck className="w-3 h-3" />
                {tier} Plan
              </span>
              <span className="text-xs text-[#8A857A]">Account ID: {user.id}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#1A1918] block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#1A1918] block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F2EEE4]">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DC]">
              <span className="text-[#8A857A] font-semibold block mb-0.5">Preferred Source</span>
              <strong className="text-[#1A1918] uppercase">{user.preferred_source_lang} (Auto Detect)</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DC]">
              <span className="text-[#8A857A] font-semibold block mb-0.5">Preferred Target</span>
              <strong className="text-[#1A1918] uppercase">{user.preferred_target_lang} (Spanish)</strong>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="gold-gradient-btn px-6 py-2.5 rounded-2xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
