import React, { useState } from 'react';
import { 
  X, ChevronRight, ArrowUpRight, Trophy, Users, MapPin, Clock, Shield, Award, Compass, Download, FileText
} from 'lucide-react';
import BenguiatTitle from './BenguiatTitle';
import CountdownClock from './CountdownClock';
import AudioToggle from './AudioToggle';
import { EVENTS_DATA } from '../data/eventsData';
import { soundEngine } from '../utils/soundEngine';

export default function ScrollySections({ 
  onScrollToSection, 
  isEntered = false, 
  onEnter, 
  modelProgress = 0, 
  isModelLoaded = false 
}) {
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [comingSoonEvent, setComingSoonEvent] = useState(null);
  const [isDevCardOpen, setIsDevCardOpen] = useState(false);
  const [isHodCardOpen, setIsHodCardOpen] = useState(false);
  const [isCoordinatorCardOpen, setIsCoordinatorCardOpen] = useState(false);

  const handleOpenRegistration = (eventId) => {
    soundEngine.playPortalGlitch();
    const targetEvent = EVENTS_DATA.find((e) => e.id === eventId) || EVENTS_DATA[0];
    if (targetEvent?.registrationLink) {
      window.open(targetEvent.registrationLink, '_blank', 'noopener,noreferrer');
    } else {
      setComingSoonEvent(targetEvent);
    }
  };

  const handleOpenDossier = (event) => {
    soundEngine.playPortalGlitch();
    setSelectedDossier(event);
  };

  const handleOpenDevCard = () => {
    soundEngine.playPortalGlitch();
    setIsDevCardOpen(true);
  };

  const handleOpenHodCard = () => {
    soundEngine.playPortalGlitch();
    setIsHodCardOpen(true);
  };

  const handleOpenCoordinatorCard = () => {
    soundEngine.playPortalGlitch();
    setIsCoordinatorCardOpen(true);
  };

  const scrollToChapter2 = () => {
    soundEngine.playPortalGlitch();
    const chapter2 = document.getElementById('chapter-2');
    if (chapter2) {
      chapter2.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-20 w-full text-white pointer-events-none select-none">
      {/* 1. Coming Soon Popup (Shown when Register is clicked before Google Form links are added) */}
      {comingSoonEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto animate-fadeIn font-sans">
          <div
            onClick={() => setComingSoonEvent(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm rounded-2xl border border-red-600/70 bg-gradient-to-b from-[#160106] via-[#090003] to-[#040002] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(255,20,35,0.3)]">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-950/80 border border-red-500/70 flex items-center justify-center shadow-[0_0_15px_rgba(255,20,30,0.4)]">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.28em] text-red-400 uppercase">
              {comingSoonEvent.title}
            </span>
            <h3 className="font-benguiat text-2xl sm:text-3xl font-bold text-white tracking-wider mt-1">
              COMING SOON
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Registration link for <span className="text-zinc-200 font-medium">{comingSoonEvent.title}</span> will open shortly.
            </p>
            <button
              onClick={() => setComingSoonEvent(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(255,20,30,0.4)] cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* 1B. Developer Profile Card Modal (Opens when clicking Developer Image/Card) */}
      {isDevCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto animate-fadeIn font-sans">
          {/* Backdrop */}
          <div
            onClick={() => setIsDevCardOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Popup Developer Card */}
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm rounded-3xl border border-red-600/70 bg-gradient-to-b from-[#160106] via-[#090003] to-[#040002] p-5 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(255,20,35,0.3)] overflow-hidden">
            {/* Ambient Crimson Glow */}
            <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

            {/* Top Header Row + Close Button */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e27] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.28em] text-red-400 uppercase">
                  CREATOR ID • 001
                </span>
              </div>
              <button
                onClick={() => setIsDevCardOpen(false)}
                className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/80 hover:border-red-500/60 hover:bg-red-950/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close developer card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Unobstructed Full Square Portrait Frame */}
            <div className="relative mx-auto w-full aspect-square mb-5">
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />

              <div className="w-full h-full rounded-2xl overflow-hidden border border-red-600/80 bg-[#0a0104] shadow-[0_12px_35px_rgba(0,0,0,0.95),0_0_25px_rgba(255,20,35,0.3)]">
                <img
                  src="/assets/img.png"
                  alt="Thanush Gowda P - Website Developer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Card Footer Details (Below Image, Zero Overlay) */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.3em] text-red-400 uppercase mb-1.5">
                WEBSITE DEVELOPER
              </span>

              <div className="inline-flex flex-col items-center">
                <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ff1e27] mb-1.5" />
                <h3 className="font-stranger-title text-2xl sm:text-3xl text-white uppercase tracking-wider leading-none">
                  THANUSH GOWDA P
                </h3>
              </div>

              <p className="mt-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <span className="block">Designed &amp; Engineered the <span className="text-white font-semibold">TechSpark 2K26</span></span>
                <span className="block mt-0.5">Web Experience • <span className="text-red-400 font-medium">ISE, APSCE</span></span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1C. HOD Profile & Acknowledgement Card Modal (Opens when clicking HOD Image/Card) */}
      {isHodCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto animate-fadeIn font-sans">
          {/* Backdrop */}
          <div
            onClick={() => setIsHodCardOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Popup HOD Card */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-red-600/70 bg-gradient-to-b from-[#160106] via-[#090003] to-[#040002] p-5 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(255,20,35,0.3)]">
            {/* Ambient Crimson Glow */}
            <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

            {/* Top Header Row + Close Button */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e27] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] text-red-400 uppercase">
                  HEAD OF DEPARTMENT • ISE
                </span>
              </div>
              <button
                onClick={() => setIsHodCardOpen(false)}
                className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/80 hover:border-red-500/60 hover:bg-red-950/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="Close HOD card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Unobstructed Portrait Frame */}
            <div className="relative mx-auto w-56 sm:w-64 aspect-square mb-5">
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />

              <div className="w-full h-full rounded-2xl overflow-hidden border border-red-600/80 bg-[#0a0104] shadow-[0_12px_35px_rgba(0,0,0,0.95),0_0_25px_rgba(255,20,35,0.3)]">
                <img
                  src="/assets/HOD_ISE.jpeg"
                  alt="Dr. Mithun B N - Head of Department, ISE"
                  className="w-full h-full object-cover object-[center_18%]"
                />
              </div>
            </div>

            {/* Card Footer Details (Below Image, Zero Overlay) */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.22em] text-red-400 uppercase mb-1.5">
                HEAD OF DEPARTMENT • INFORMATION SCIENCE &amp; ENGINEERING
              </span>

              <div className="inline-flex flex-col items-center">
                <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ff1e27] mb-1.5" />
                <h3 className="font-stranger-title text-2xl sm:text-3xl text-white uppercase tracking-wider leading-none">
                  DR. MITHUN B N
                </h3>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed text-center">
                We sincerely thank <span className="text-white font-semibold">Dr. Mithun B N</span>, Head of the Department of Information Science and Engineering, for his constant encouragement and leadership in bringing TechSpark 2K26 to life. His guidance inspires students to explore new ideas, build technical skills, and achieve excellence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1D. Department Forum Coordinator Profile & Acknowledgement Modal (Opens when clicking Coordinator Card) */}
      {isCoordinatorCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto animate-fadeIn font-sans">
          {/* Backdrop */}
          <div
            onClick={() => setIsCoordinatorCardOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Popup Coordinator Card */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-red-600/70 bg-gradient-to-b from-[#160106] via-[#090003] to-[#040002] p-5 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(255,20,35,0.3)]">
            {/* Ambient Crimson Glow */}
            <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

            {/* Top Header Row + Close Button */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e27] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] text-red-400 uppercase">
                  FORUM COORDINATOR • ISE
                </span>
              </div>
              <button
                onClick={() => setIsCoordinatorCardOpen(false)}
                className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/80 hover:border-red-500/60 hover:bg-red-950/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="Close Coordinator card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Unobstructed Portrait Frame */}
            <div className="relative mx-auto w-56 sm:w-64 aspect-square mb-5">
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-red-500 shadow-[0_0_10px_#ff1e27] pointer-events-none z-20" />

              <div className="w-full h-full rounded-2xl overflow-hidden border border-red-600/80 bg-[#0a0104] shadow-[0_12px_35px_rgba(0,0,0,0.95),0_0_25px_rgba(255,20,35,0.3)]">
                <img
                  src="/assets/Lohith.jpeg"
                  alt="Prof. Lohithkumar J K - Department Forum Coordinator, ISE"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/FORUM_COORDINATOR_ISE.jpeg';
                  }}
                />
              </div>
            </div>

            {/* Card Footer Details */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.22em] text-red-400 uppercase mb-1.5">
                DEPARTMENT FORUM COORDINATOR • INFORMATION SCIENCE &amp; ENGINEERING
              </span>

              <div className="inline-flex flex-col items-center">
                <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ff1e27] mb-1.5" />
                <h3 className="font-stranger-title text-2xl sm:text-3xl text-white uppercase tracking-wider leading-none">
                  PROF. LOHITHKUMAR J K
                </h3>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed text-center">
                We sincerely thank <span className="text-white font-semibold">Prof. Lohithkumar J K</span>, Department Forum Coordinator, for his continuous guidance, encouragement, and support in coordinating TechSpark 2K26 and mentoring our students.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Cinematic Slide-Out Dossier Drawer (Spacious, Human-Crafted Editorial Layout) */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-auto animate-fadeIn">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setSelectedDossier(null)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer transition-opacity"
          />

          {/* Slide-out drawer panel */}
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#140105] via-[#0a0003] to-[#040002] border-l border-red-800/80 shadow-[-25px_0_60px_rgba(255,10,30,0.5)] flex flex-col h-full overflow-hidden animate-slideInRight font-sans">
            
            {/* Top Banner Artwork */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden flex-shrink-0">
              <img 
                src={selectedDossier.image} 
                alt={selectedDossier.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140105] via-[#140105]/60 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDossier(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/60 hover:bg-red-950 text-zinc-300 hover:text-white border border-zinc-800 hover:border-red-600 transition-all cursor-pointer shadow-lg"
                aria-label="Close Dossier"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header on banner */}
              <div className="absolute bottom-5 left-6 right-6">
                <div className="text-xs font-semibold tracking-wider text-red-400 uppercase mb-1">
                  {selectedDossier.category}
                </div>
                <h2 className="font-benguiat text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  {selectedDossier.title}
                </h2>
                <div className="text-sm text-zinc-300 font-serif italic mt-0.5">
                  {selectedDossier.tagline}
                </div>
              </div>
            </div>

            {/* Dossier Body Content - Clean, Un-congested Editorial Architecture */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-7 text-zinc-200">
              
              {/* Event Specs Strip (Clean hairline dividers instead of nested boxes) */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-800/80 text-xs">
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Team Size</div>
                  <div className="font-semibold text-white">{selectedDossier.teamSize}</div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Venue</div>
                  <div className="font-semibold text-white">{selectedDossier.venue}</div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Timing</div>
                  <div className="font-semibold text-white">{selectedDossier.timing}</div>
                </div>
              </div>

              {/* Prize Pool Callout (Only shown if event has a prizePool) */}
              {selectedDossier.prizePool && (
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-xs text-zinc-400 uppercase tracking-wider">Cash Prize</div>
                    <div className="font-benguiat text-2xl sm:text-3xl font-bold text-amber-400 mt-0.5">
                      {selectedDossier.prizePool}
                    </div>
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    <div>October 15, 2026</div>
                    <div className="text-red-400 font-medium">{selectedDossier.venue}</div>
                  </div>
                </div>
              )}

              {/* About the Event */}
              <div>
                <h3 className="text-xs font-bold tracking-wider text-red-400 uppercase mb-2">
                  About the Event
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                  {selectedDossier.missionBrief}
                </p>
              </div>

              {/* Prizes & Rewards (Only shown if event has rewards defined) */}
              {selectedDossier.rewards && selectedDossier.rewards.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-red-400 uppercase mb-3">
                    Prizes &amp; Rewards
                  </h3>
                  <div className="space-y-2.5">
                    {selectedDossier.rewards.map((reward, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                        <span className="text-amber-400 font-bold">★</span>
                        <span>{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules & Guidelines */}
              <div>
                <h3 className="text-xs font-bold tracking-wider text-red-400 uppercase mb-3">
                  Rules &amp; Guidelines
                </h3>
                <div className="space-y-3">
                  {selectedDossier.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300 leading-normal">
                      <span className="text-red-500 font-bold text-xs mt-0.5">0{idx + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>

                {/* Download Official Event Brochure & Rules PDF */}
                {selectedDossier.brochureUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedDossier.brochureUrl}
                      download={`${selectedDossier.title.replace(/\s+/g, '_')}_Rules.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/pdf w-full p-3.5 rounded-xl border border-red-800/80 hover:border-red-500 bg-gradient-to-r from-red-950/40 via-[#120105] to-red-950/40 flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-red-900/40 border border-red-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,20,30,0.3)]">
                          <FileText className="w-4 h-4 text-red-400 group-hover/pdf:text-white transition-colors" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="text-xs font-bold tracking-wider text-white uppercase truncate">
                            DOWNLOAD {selectedDossier.title} BROCHURE
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate">
                            Official rules, format &amp; guidelines PDF
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-800/90 group-hover/pdf:bg-red-700 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-[0_0_12px_rgba(255,20,30,0.4)]">
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">PDF</span>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="p-5 sm:p-6 border-t border-zinc-800/80 bg-[#090003] flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedDossier(null)}
                className="py-3 px-5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const id = selectedDossier.id;
                  setSelectedDossier(null);
                  handleOpenRegistration(id);
                }}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-benguiat font-bold text-sm tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(255,20,30,0.5)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Register for {selectedDossier.title}</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CHAPTER 1: THE GATE (Hero Stage)
          ========================================================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 pt-2 sm:pt-4">
        {/* Minimalist Floating Header - Clean, Borderless */}
        <div className="w-full flex items-center justify-between px-2 sm:px-4 pt-1 pointer-events-auto select-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_#ff1e27] animate-pulse" />
            <span className="font-sans text-xs tracking-wider text-zinc-400 font-medium">
              APSCE <span className="text-red-500 font-bold mx-1">•</span> Department of ISE
            </span>
          </div>

          <AudioToggle />
        </div>

        {/* Hero Title & Staging */}
        <div className="flex-1 flex flex-col items-center justify-start text-center pt-1 sm:pt-3 w-full">
          <BenguiatTitle 
            isEntered={isEntered}
            onEnter={onEnter}
            modelProgress={modelProgress}
            isModelLoaded={isModelLoaded}
          />
        </div>

        {/* Bottom Stage: Countdown Clock (Pushed Full Down) + Scroll Indicator */}
        <div className={`flex flex-col items-center justify-center gap-2.5 sm:gap-3 pb-1.5 sm:pb-2 pointer-events-auto transition-all duration-1000 ${
          isEntered 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}>
          <CountdownClock />

          <div className="flex flex-col items-center justify-center gap-1 text-zinc-400 font-sans text-xs tracking-wider">
            <span className="text-red-400 animate-pulse text-[11px] sm:text-xs tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Scroll down to explore events
            </span>
            <ChevronRight className="w-4 h-4 text-red-500 rotate-90 animate-bounce" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 2: THE FOUR EVENTS (Compact Cards on Mobile, Full Poster Cards on Laptop)
          ========================================================================= */}
      <section 
        id="chapter-2"
        className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-10 my-10 sm:my-20"
      >
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-stretch gap-6 sm:gap-10 pointer-events-auto">
          
          {/* Left Vertical Editorial Spine */}
          <div className="hidden lg:flex flex-col justify-between items-center py-4 border-r border-red-950/80 pr-6 select-none">
            <span className="text-xs text-red-500 font-semibold tracking-widest font-sans">
              2K26
            </span>

            <div className="vertical-editorial-text font-benguiat text-4xl xl:text-5xl font-black text-red-600/30 tracking-widest my-8">
              ( EVENTS )
            </div>

            <div className="vertical-editorial-text text-[11px] text-zinc-500 tracking-widest uppercase font-sans">
              TechSpark 2K26 • ISE
            </div>
          </div>

          {/* Main Grid Content Area */}
          <div className="flex-1 flex flex-col gap-5 sm:gap-8 font-sans">
            
            {/* Editorial Header - Clean, Human-Designed Hierarchy */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-5">
              <div>
                <h2 className="font-benguiat text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
                  CHOOSE YOUR EXPEDITION
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 mt-2 font-normal">
                  Four flagship department events. Register your squad and battle for victory.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e27]" />
                <span>Department of ISE, APSCE • October 15, 2026</span>
              </div>
            </div>

            {/* 4 Event Cards:
                - Mobile (< sm): Compact detail card (no background image, no top category text, keeps 01-04 red outlined number at top-right)
                - Laptop/Tablet (sm+): Full 440px poster card with background image and top category label */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {EVENTS_DATA.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleOpenDossier(evt)}
                  className="netflix-poster-card group relative rounded-2xl overflow-hidden border border-zinc-800/90 hover:border-red-600/80 bg-gradient-to-br from-[#120105]/95 via-[#080003]/95 to-[#040002]/95 sm:bg-black/85 backdrop-blur-xl cursor-pointer flex flex-col justify-between min-h-0 sm:min-h-[440px] shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                >
                  {/* Poster Background Image with Vignette — Shown ONLY on Laptop/Tablet (sm+), Hidden on Mobile */}
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="hidden sm:block absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-65 group-hover:scale-108 transition-all duration-700"
                  />
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

                  {/* Top Card Info Bar:
                      - On Mobile: Floating top-right for 01, 02, 03, 04 (no category text, no top empty space)
                      - On Laptop (sm+): Full top bar with category on left and 01-04 on right */}
                  <div className="absolute top-4 right-5 sm:static sm:p-5 flex items-start justify-end sm:justify-between z-10 pointer-events-none">
                    <span className="hidden sm:inline-block text-xs font-semibold text-red-400 tracking-wider uppercase font-sans">
                      {evt.category}
                    </span>

                    {/* Giant Red Glowing Number (01, 02, 03, 04) — Same Style Everywhere */}
                    <span className="stroke-text-red font-benguiat text-4xl sm:text-5xl font-black group-hover:neon-text-red transition-all leading-none">
                      {evt.code}
                    </span>
                  </div>

                  {/* Card Details Content (Fills card compactly on Mobile; sits at bottom on Laptop) */}
                  <div className="relative p-5 sm:p-6 z-10 flex flex-col gap-2">
                    {/* Prize Badge (Shown only if prizePool exists) */}
                    {evt.prizePool && (
                      <div className="text-amber-400 font-sans text-sm font-bold pr-14 sm:pr-0">
                        {evt.prizePool}
                      </div>
                    )}

                    {/* Event Title */}
                    <h3 className="font-benguiat text-2xl sm:text-3xl font-bold text-white tracking-wide group-hover:text-red-200 transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] pr-12 sm:pr-0">
                      {evt.title}
                    </h3>

                    {/* Tagline */}
                    <p className="text-xs text-zinc-400 line-clamp-1 font-serif italic">
                      {evt.tagline}
                    </p>

                    {/* Meta Specs */}
                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/80 font-sans">
                      <span>{evt.teamSize}</span>
                      <span className="text-zinc-300">{evt.venue.split(' (')[0]}</span>
                    </div>

                    {/* Action Bar on Card */}
                    <div className="mt-2 pt-2 flex items-center gap-2 font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDossier(evt);
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-black/60 hover:bg-red-950/70 border border-zinc-800 hover:border-red-800 text-zinc-300 hover:text-white text-xs font-medium transition-all"
                      >
                        View Details
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRegistration(evt.id);
                        }}
                        className="py-2 px-3.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(255,20,30,0.4)] flex items-center gap-1"
                      >
                        <span>Register</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtext */}
            <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80 pt-3 font-sans">
              <span>Tap any event card to view complete rules, timings, and event details.</span>
              <span className="text-red-400 font-medium">October 15, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOD ACKNOWLEDGEMENT & DEVELOPER CREDIT (Dr. Mithun B N above Thanush Gowda P)
          Placed after Chapter 2 and before Chapter 3 — Horizontal on mobile & desktop
          ========================================================================= */}
      <section 
        id="developer-spotlight"
        className="relative w-full flex flex-col items-center justify-center gap-5 sm:gap-7 px-3 sm:px-4 py-6 sm:py-10 my-4 sm:my-8"
      >

        {/* 1. HOD ACKNOWLEDGEMENT CARD (Dr. Mithun B N — Above Developer Card) */}
        <div className="w-full max-w-2xl pointer-events-auto font-sans">
          <div
            onClick={handleOpenHodCard}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenHodCard(); }}
            className="group relative rounded-2xl border border-red-900/60 hover:border-red-500/80 bg-gradient-to-r from-[#120105]/95 via-[#090003]/95 to-[#120105]/95 backdrop-blur-xl px-4 py-4 sm:px-6 sm:py-5 shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(255,15,30,0.18)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.95),0_0_40px_rgba(255,20,35,0.35)] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Subtle Ambient Rift Glow */}
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-red-600/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-row items-center sm:items-start gap-3.5 sm:gap-6">
              {/* Unobstructed Portrait Frame (Zero Text Overlay, 1:1 Square, Clickable) */}
              <div className="relative shrink-0 w-20 h-20 xs:w-22 xs:h-22 sm:w-28 sm:h-28">
                <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />

                <div className="relative w-full h-full rounded-xl overflow-hidden border border-red-600/80 bg-[#0a0104] shadow-[0_0_20px_rgba(255,20,35,0.3)]">
                  <img
                    src="/assets/HOD_ISE.jpeg"
                    alt="Dr. Mithun B N - Head of Department, ISE"
                    className="w-full h-full object-cover object-[center_18%] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Right Column: Title, Role & Acknowledgement */}
              <div className="flex-1 flex flex-col items-start text-left min-w-0">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.26em] text-red-400 uppercase mb-1">
                  HEAD OF DEPARTMENT • ISE
                </span>

                <div className="inline-flex flex-col items-start">
                  <div className="w-full h-[1.5px] bg-gradient-to-r from-red-500 via-red-400 to-transparent shadow-[0_0_8px_#ff1e27] mb-1" />
                  <h3 className="font-stranger-title text-[17px] xs:text-lg sm:text-2xl text-white uppercase tracking-wider leading-none whitespace-nowrap">
                    DR. MITHUN B N
                  </h3>
                </div>

                <p className="mt-1 text-[11px] xs:text-xs sm:text-xs text-red-400/95 font-normal leading-snug">
                  Head of Department, Information Science &amp; Engineering
                </p>

                {/* Desktop Acknowledgement Paragraph */}
                <p className="hidden sm:block mt-2 text-xs sm:text-[13px] text-zinc-300 font-normal leading-relaxed">
                  We sincerely thank <span className="text-white font-semibold">Dr. Mithun B N</span>, Head of the Department of Information Science and Engineering, for his constant encouragement and leadership in bringing TechSpark 2K26 to life. His guidance inspires students to explore new ideas, build technical skills, and achieve excellence.
                </p>
              </div>
            </div>

            {/* Mobile Full-Width Acknowledgement Paragraph (Clean, Un-congested Line Wrapping on Phones) */}
            <p className="sm:hidden relative z-10 mt-3 pt-3 border-t border-red-950/60 text-[11.5px] text-zinc-300 font-normal leading-relaxed text-left">
              We sincerely thank <span className="text-white font-semibold">Dr. Mithun B N</span>, Head of the Department of Information Science and Engineering, for his constant encouragement and leadership in bringing TechSpark 2K26 to life. His guidance inspires students to explore new ideas, build technical skills, and achieve excellence.
            </p>
          </div>
        </div>

        {/* 2. DEPARTMENT FORUM COORDINATOR CARD (Prof. Lohithkumar J K — Above Developer Card) */}
        <div className="w-full max-w-2xl pointer-events-auto font-sans">
          <div
            onClick={handleOpenCoordinatorCard}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenCoordinatorCard(); }}
            className="group relative rounded-2xl border border-red-900/60 hover:border-red-500/80 bg-gradient-to-r from-[#140105]/95 via-[#080003]/95 to-[#140105]/95 backdrop-blur-xl px-4 py-3.5 sm:px-6 sm:py-5 shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(255,15,30,0.18)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.95),0_0_40px_rgba(255,20,35,0.35)] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Subtle Ambient Rift Glow */}
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-red-600/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-row items-center gap-3.5 sm:gap-6">
              {/* Unobstructed Portrait Frame (Zero Text Overlay, 1:1 Square, Clickable) */}
              <div className="relative shrink-0 w-20 h-20 xs:w-22 xs:h-22 sm:w-28 sm:h-28">
                <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />

                <div className="relative w-full h-full rounded-xl overflow-hidden border border-red-600/80 bg-[#0a0104] shadow-[0_0_20px_rgba(255,20,35,0.3)]">
                  <img
                    src="/assets/Lohith.jpeg"
                    alt="Prof. Lohithkumar J K - Department Forum Coordinator, ISE"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/FORUM_COORDINATOR_ISE.jpeg';
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Title, Role & Acknowledgement */}
              <div className="flex-1 flex flex-col items-start text-left min-w-0">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.26em] text-red-400 uppercase mb-1">
                  DEPARTMENT FORUM COORDINATOR • ISE
                </span>

                <div className="inline-flex flex-col items-start">
                  <div className="w-full h-[1.5px] bg-gradient-to-r from-red-500 via-red-400 to-transparent shadow-[0_0_8px_#ff1e27] mb-1" />
                  <h3 className="font-stranger-title text-[17px] xs:text-lg sm:text-2xl text-white uppercase tracking-wider leading-none whitespace-nowrap">
                    PROF. LOHITHKUMAR J K
                  </h3>
                </div>

                <p className="mt-1 text-[11px] xs:text-xs sm:text-xs text-red-400/95 font-normal leading-snug">
                  Department Forum Coordinator, Information Science &amp; Engineering
                </p>

                {/* Desktop Acknowledgement Paragraph */}
                <p className="hidden sm:block mt-2 text-xs sm:text-[13px] text-zinc-300 font-normal leading-relaxed">
                  We sincerely thank <span className="text-white font-semibold">Prof. Lohithkumar J K</span>, Department Forum Coordinator, for his continuous guidance, encouragement, and support in coordinating TechSpark 2K26 and mentoring our students.
                </p>
              </div>
            </div>

            {/* Mobile Full-Width Acknowledgement Paragraph (Clean, Un-congested Line Wrapping on Phones) */}
            <p className="sm:hidden relative z-10 mt-3 pt-3 border-t border-red-950/60 text-[11.5px] text-zinc-300 font-normal leading-relaxed text-left">
              We sincerely thank <span className="text-white font-semibold">Prof. Lohithkumar J K</span>, Department Forum Coordinator, for his continuous guidance, encouragement, and support in coordinating TechSpark 2K26 and mentoring our students.
            </p>
          </div>
        </div>

        {/* 3. DEVELOPER CREDIT CARD (Thanush Gowda P — Below Coordinator Card) */}
        <div className="w-fit max-w-full pointer-events-auto font-sans">
          <div
            onClick={handleOpenDevCard}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenDevCard(); }}
            className="group relative rounded-2xl border border-red-900/60 hover:border-red-500/80 bg-gradient-to-r from-[#120105]/95 via-[#090003]/95 to-[#120105]/95 backdrop-blur-xl px-4 py-3.5 sm:px-6 sm:py-5 shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(255,15,30,0.18)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.95),0_0_40px_rgba(255,20,35,0.35)] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Subtle Ambient Rift Glow */}
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-red-600/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-row items-center gap-3.5 sm:gap-6">
              
              {/* Unobstructed Portrait Frame (Zero Text Overlay, 1:1 Square, Clickable) */}
              <div className="relative shrink-0 w-20 h-20 xs:w-22 xs:h-22 sm:w-28 sm:h-28">
                {/* Corner Crimson Brackets */}
                <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500 shadow-[0_0_8px_#ff1e27] pointer-events-none z-20" />

                <div className="relative w-full h-full rounded-xl overflow-hidden border border-red-600/80 bg-[#0a0104] shadow-[0_0_20px_rgba(255,20,35,0.3)]">
                  <img
                    src="/assets/img.png"
                    alt="Thanush Gowda P - Website Developer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Compact Credit Info Beside Photo (Always Left-Aligned on Phone & Desktop) */}
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.26em] sm:tracking-[0.3em] text-red-400 uppercase mb-1">
                  WEBSITE DEVELOPER
                </span>

                <div className="inline-flex flex-col items-start">
                  <div className="w-full h-[1.5px] bg-gradient-to-r from-red-500 via-red-400 to-transparent shadow-[0_0_8px_#ff1e27] mb-1" />
                  <h3 className="font-stranger-title text-[17px] xs:text-lg sm:text-2xl text-white uppercase tracking-wider leading-none whitespace-nowrap">
                    THANUSH GOWDA P
                  </h3>
                </div>

                <p className="mt-1.5 text-[11px] xs:text-xs sm:text-sm text-zinc-400 leading-snug">
                  <span className="block whitespace-nowrap">
                    Designed &amp; Engineered the <span className="text-zinc-200 font-semibold">TechSpark 2K26</span>
                  </span>
                  <span className="block whitespace-nowrap mt-0.5">
                    Web Experience • <span className="text-red-400/95">ISE, APSCE</span>
                  </span>
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 3: SURVIVAL FINALE (Cinematic Netflix-Style Closing Stage)
          ========================================================================= */}
      <section
        id="chapter-3"
        className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-12 text-center pointer-events-none"
      >
        {/* Top Header Badge */}
        <div className="pointer-events-auto mt-6 sm:mt-12 flex flex-col items-center font-sans">
          <h2 className="font-benguiat text-3xl sm:text-6xl text-white tracking-wider mt-4 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] max-w-4xl">
            CONNECTING WITH REALITY IS YOUR ONLY WAY OUT
          </h2>
          
          <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-2xl font-normal leading-relaxed">
            The annual inter-college tech &amp; gaming fest by the Department of Information Science &amp; Engineering, APSCE.
          </p>
        </div>

        {/* Guaranteed Open Space for 3D Demogorgon Face & Body */}
        <div className="w-full flex-1 min-h-[52vh] sm:min-h-[56vh]" />

        {/* Bottom Interactive Buttons of Chapter 3 */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-6 pointer-events-auto mb-6 sm:mb-10 font-sans">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToChapter2}
              className="group relative px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-red-950/90 via-[#200206] to-red-950/90 hover:from-red-900/90 hover:to-red-900/90 border border-red-500/80 hover:border-red-400 text-white font-benguiat text-sm sm:text-base tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,20,30,0.55)] hover:shadow-[0_0_50px_rgba(255,30,40,0.85)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3 overflow-hidden"
            >
              {/* Ambient red sweep shine on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              
              {/* Left red pulsing rift light */}
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ff1e27] group-hover:animate-ping flex-shrink-0" />
              
              <span className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                VIEW ALL 4 EVENTS
              </span>
              
              <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 flex-shrink-0" />
            </button>

            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-black/80 hover:bg-red-950/50 border border-zinc-800 hover:border-red-900/80 text-zinc-400 hover:text-white text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 active:scale-95 font-medium"
            >
              <span>Back to Top ↑</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL FOOTER & LOCKED-DOWN CINEMATIC VIDEO (Separate from 3D Model Stage)
          ========================================================================= */}
      <footer
        id="final-footer"
        className="relative z-30 w-full bg-gradient-to-b from-transparent via-black/95 to-black pt-10 pb-10 px-4 sm:px-12 pointer-events-auto font-sans"
      >
        <div className="w-full max-w-4xl mx-auto border-t border-zinc-800/80 pt-6 flex flex-col gap-6">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-white font-semibold font-benguiat text-sm tracking-wider">TECHSPARK 2K26</span>
              <span className="text-zinc-600">•</span>
              <span>Department of Information Science &amp; Engineering</span>
            </div>
            <div>
              APS College of Engineering, Bengaluru • October 15, 2026
            </div>
          </div>

          {/* Final Footer Video: Muted, Loop, Zero Controls (No Fullscreen, Zoom, Pause, Skip, Long-Press, or Double-Tap) */}
          <div
            className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-red-950/60 bg-black shadow-[0_15px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(255,15,30,0.15)] select-none"
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              touchAction: 'pan-y',
            }}
            onContextMenu={(e) => e.preventDefault()}
            onDoubleClick={(e) => e.preventDefault()}
          >
            {/* Transparent Interaction Shield: Blocks tap, double-tap, long-press, zoom, and context menu while allowing vertical scroll */}
            <div
              className="absolute inset-0 z-20 select-none"
              style={{
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'pan-y',
              }}
              onContextMenu={(e) => e.preventDefault()}
              onDoubleClick={(e) => e.preventDefault()}
              onClick={(e) => e.preventDefault()}
            />

            <video
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.muted = true;
                }
              }}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
              tabIndex={-1}
              aria-hidden="true"
              onContextMenu={(e) => e.preventDefault()}
              onPause={(e) => {
                e.currentTarget.play().catch(() => {});
              }}
              onVolumeChange={(e) => {
                e.currentTarget.muted = true;
                e.currentTarget.volume = 0;
              }}
              className="w-full aspect-video object-cover pointer-events-none select-none block"
            >
              <source src="/assets/APSCE_THINGS_VID.webm" type="video/webm" />
              <source src="/assets/APSCE_THINGS_VID.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </footer>
    </div>
  );
}
