import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Ticket, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function EventRegistrationModal({
  isOpen = false,
  onClose,
  initialEventId = '01',
  events = []
}) {
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [form, setForm] = useState({
    leaderName: '',
    email: '',
    phone: '',
    college: '',
    usn: '',
    teamSize: '2',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passCode, setPassCode] = useState('');

  // Update selected event if changed externally
  React.useEffect(() => {
    if (initialEventId) setSelectedEventId(initialEventId);
  }, [initialEventId]);

  if (!isOpen) return null;

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0] || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.leaderName || !form.phone || !form.college) {
      alert("Please enter Team Leader Name, Phone, and College Name to complete registration.");
      return;
    }
    soundEngine.playDemogorgonRoar(0.35);
    const randomCode = `HWK-${Math.floor(1000 + Math.random() * 9000)}-${currentEvent.title?.slice(0, 3)?.toUpperCase() || 'ISE'}`;
    setPassCode(randomCode);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setForm({
      leaderName: '',
      email: '',
      phone: '',
      college: '',
      usn: '',
      teamSize: '2',
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn font-sans">
      {/* Outer Modal Container with Crimson Glow */}
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#140205] to-[#070003] border border-red-800/80 rounded-2xl p-5 sm:p-7 shadow-[0_0_50px_rgba(255,20,30,0.4)] text-white overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Top Scanlines and Ambient Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ff0000]" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-600/70 flex items-center justify-center shadow-[0_0_10px_rgba(255,20,30,0.5)]">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-benguiat tracking-wider">
                TechSpark 2K26 Event Registration
              </div>
              <div className="text-xs text-zinc-400">
                Department of ISE • APS College of Engineering • October 15, 2026
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative flex-1 overflow-y-auto py-4 space-y-4">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Event Selector Tabs */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Select Event
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {events.map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => {
                        setSelectedEventId(evt.id);
                      }}
                      className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                        selectedEventId === evt.id
                          ? 'bg-red-950/80 border-red-500 text-white shadow-[0_0_15px_rgba(255,20,30,0.4)] scale-[1.02]'
                          : 'bg-black/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="text-[10px] text-red-400 font-semibold tracking-wider">
                        EVENT {evt.id}
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5 font-benguiat text-white">
                        {evt.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Quick Info Banner */}
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-400">Selected: </span>
                  <span className="text-white font-bold">{currentEvent.title}</span>
                  <span className="text-zinc-400 ml-2 font-normal">({currentEvent.venue})</span>
                </div>
                <div className="text-amber-400 font-bold font-benguiat text-sm">
                  {currentEvent.prizePool}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                    Team Leader Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={form.leaderName}
                    onChange={(e) => setForm({ ...form, leaderName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-zinc-800 focus:border-red-500 text-white text-xs outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-zinc-800 focus:border-red-500 text-white text-xs outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                      College / Institution *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. APSCE, RVCE, BMSCE..."
                      value={form.college}
                      onChange={(e) => setForm({ ...form, college: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-zinc-800 focus:border-red-500 text-white text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                      USN / Student ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1AP22IS001"
                      value={form.usn}
                      onChange={(e) => setForm({ ...form, usn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-zinc-800 focus:border-red-500 text-white text-xs outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                      Team Size
                    </label>
                    <select
                      value={form.teamSize}
                      onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-zinc-800 focus:border-red-500 text-white text-xs outline-none transition-colors"
                    >
                      <option value="1">1 Member (Solo)</option>
                      <option value="2">2 Members (Duo)</option>
                      <option value="3">3 Members (Trio)</option>
                      <option value="4">4 Members (Team)</option>
                      <option value="6">6-8 Members (Cricket Team)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-benguiat text-sm tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_25px_rgba(255,20,30,0.5)] cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-2"
              >
                <span>Confirm Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Digital Pass Display */
            <div className="flex flex-col items-center text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center shadow-[0_0_25px_rgba(255,20,30,0.7)] animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-red-400" />
              </div>

              <div>
                <span className="text-xs text-red-400 font-semibold tracking-wider uppercase">
                  Registration Confirmed
                </span>
                <h3 className="font-benguiat text-2xl sm:text-3xl font-bold text-white tracking-wide mt-1">
                  TechSpark 2K26 Entry Pass
                </h3>
              </div>

              {/* Digital Ticket Card */}
              <div className="w-full p-5 rounded-2xl bg-black/80 border border-zinc-800 shadow-[0_0_30px_rgba(255,20,30,0.3)] text-left relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
                  <div className="text-xs font-bold text-white font-benguiat">
                    TechSpark 2K26 • Dept of ISE
                  </div>
                  <div className="text-xs bg-red-950 px-2.5 py-1 rounded-md text-amber-300 font-mono font-bold border border-red-800">
                    {passCode}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Event</span>
                    <span className="text-white font-bold">{currentEvent.title}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Date</span>
                    <span className="text-red-400 font-semibold">October 15, 2026</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Team Leader</span>
                    <span className="text-white">{form.leaderName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">College</span>
                    <span className="text-white truncate block">{form.college}</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>Venue: APSCE Campus</span>
                  <span className="text-red-400">Bring College ID on Oct 15</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Entry Pass ${passCode} saved! Keep this confirmation for entry on October 15th.`)}
                  className="flex-1 py-3 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,20,30,0.5)] cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Save Pass</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
