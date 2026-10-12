import React, { useState } from 'react';
import { 
  X, ChevronRight, ArrowUpRight, Trophy, Users, MapPin, Clock, Shield, Award, Compass
} from 'lucide-react';
import BenguiatTitle from './BenguiatTitle';
import CountdownClock from './CountdownClock';
import AudioToggle from './AudioToggle';
import EventRegistrationModal from './EventRegistrationModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEventId, setModalEventId] = useState('01');

  const handleOpenRegistration = (eventId) => {
    soundEngine.playPortalGlitch();
    setModalEventId(eventId || '01');
    setIsModalOpen(true);
  };

  const handleOpenDossier = (event) => {
    soundEngine.playPortalGlitch();
    setSelectedDossier(event);
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
      {/* 1. Official Registration Modal */}
      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialEventId={modalEventId}
        events={EVENTS_DATA}
      />

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
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Squad Size</div>
                  <div className="font-semibold text-white">{selectedDossier.teamSize}</div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Location</div>
                  <div className="font-semibold text-white">{selectedDossier.venue}</div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Time Slot</div>
                  <div className="font-semibold text-white">{selectedDossier.timing}</div>
                </div>
              </div>

              {/* Prize Pool Callout */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wider">Total Cash Prize Pool</div>
                  <div className="font-benguiat text-2xl sm:text-3xl font-bold text-amber-400 mt-0.5">
                    {selectedDossier.prizePool}
                  </div>
                </div>
                <div className="text-right text-xs text-zinc-400">
                  <div>October 15, 2026</div>
                  <div className="text-red-400 font-medium">APSCE Campus</div>
                </div>
              </div>

              {/* Mission Directive / Briefing */}
              <div>
                <h3 className="text-xs font-bold tracking-wider text-red-400 uppercase mb-2">
                  Mission Directive
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                  {selectedDossier.missionBrief}
                </p>
              </div>

              {/* Prize Distribution */}
              <div>
                <h3 className="text-xs font-bold tracking-wider text-red-400 uppercase mb-3">
                  Prize Distribution
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

              {/* Rules & Guidelines (Clean numbered points with generous breathing room) */}
              <div>
                <h3 className="text-xs font-bold tracking-wider text-red-400 uppercase mb-3">
                  Rules & Protocols
                </h3>
                <div className="space-y-3">
                  {selectedDossier.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300 leading-normal">
                      <span className="text-red-500 font-bold text-xs mt-0.5">0{idx + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dossier Bottom Action Bar */}
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
              Scroll down to enter the upside down
            </span>
            <ChevronRight className="w-4 h-4 text-red-500 rotate-90 animate-bounce" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 2: THE FOUR ARENAS (Grand Netflix-Style Editorial Grid)
          ========================================================================= */}
      <section 
        id="chapter-2"
        className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-10 my-12 sm:my-20"
      >
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-stretch gap-6 sm:gap-10 pointer-events-auto">
          
          {/* Left Vertical Editorial Spine */}
          <div className="hidden lg:flex flex-col justify-between items-center py-4 border-r border-red-950/80 pr-6 select-none">
            <span className="text-xs text-red-500 font-semibold tracking-widest font-sans">
              2K26
            </span>

            <div className="vertical-editorial-text font-benguiat text-4xl xl:text-5xl font-black text-red-600/30 tracking-widest my-8">
              ( SEC. 002 )
            </div>

            <div className="vertical-editorial-text text-[11px] text-zinc-500 tracking-widest uppercase font-sans">
              This World • The Other Side
            </div>
          </div>

          {/* Main Grid Content Area */}
          <div className="flex-1 flex flex-col gap-6 sm:gap-8 font-sans">
            
            {/* Editorial Header - Clean, Human-Designed Hierarchy */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-5">
              <div>
                <h2 className="font-benguiat text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
                  CHOOSE YOUR EXPEDITION
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 mt-2 font-normal">
                  Four flagship competitive arenas. Over <span className="text-amber-400 font-semibold font-benguiat">₹57,000</span> in cash prize bounties.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e27]" />
                <span>Department of ISE, APSCE • October 15, 2026</span>
              </div>
            </div>

            {/* 4 Large Netflix-Style Poster Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {EVENTS_DATA.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleOpenDossier(evt)}
                  className="netflix-poster-card group relative rounded-2xl overflow-hidden border border-zinc-800/90 hover:border-red-600/80 bg-black/85 backdrop-blur-xl cursor-pointer flex flex-col justify-between min-h-[440px] shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                >
                  {/* Poster Background Image with Vignette */}
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-65 group-hover:scale-108 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

                  {/* Top Card Info Bar */}
                  <div className="relative p-4 sm:p-5 flex items-start justify-between z-10">
                    <span className="text-xs font-semibold text-red-400 tracking-wider uppercase font-sans">
                      {evt.category}
                    </span>

                    {/* Giant Red Glowing Number (01, 02, 03, 04) */}
                    <span className="stroke-text-red font-benguiat text-4xl sm:text-5xl font-black group-hover:neon-text-red transition-all">
                      {evt.code}
                    </span>
                  </div>

                  {/* Bottom Card Content */}
                  <div className="relative p-5 sm:p-6 z-10 flex flex-col gap-2">
                    {/* Bounty Badge */}
                    <div className="text-amber-400 font-sans text-sm font-bold">
                      {evt.prizePool}
                    </div>

                    {/* Event Title */}
                    <h3 className="font-benguiat text-2xl sm:text-3xl font-bold text-white tracking-wide group-hover:text-red-200 transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
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
                        Dossier
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRegistration(evt.id);
                        }}
                        className="py-2 px-3.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(255,20,30,0.4)] flex items-center gap-1"
                      >
                        <span>Enlist</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtext */}
            <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80 pt-3 font-sans">
              <span>Select any arena card to view complete directives and prize breakdown.</span>
              <span className="text-red-400 font-medium">October 15, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 3: SURVIVAL FINALE (Cinematic Netflix-Style Closing Stage)
          ========================================================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-12 text-center pointer-events-none">
        
        {/* Top Header Badge */}
        <div className="pointer-events-auto mt-6 sm:mt-12 flex flex-col items-center font-sans">
          <h2 className="font-benguiat text-3xl sm:text-6xl text-white tracking-wider mt-4 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] max-w-4xl">
            CONNECTING WITH REALITY IS YOUR ONLY WAY OUT
          </h2>
          
          <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-2xl font-normal leading-relaxed">
            The annual inter-collegiate tech symposium presented by Department of Information Science & Engineering, APSCE.
          </p>
        </div>

        {/* Center Space Clear for 3D Demogorgon */}
        <div className="w-full flex-1" />

        {/* Bottom Interactive Terminal & Official Footer */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-6 pointer-events-auto mb-4 font-sans">
          
          {/* Main Action Buttons */}
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
                EXPLORE THE 4 ARENAS
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

          {/* Prestige Festival Footer */}
          <footer className="w-full border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold font-benguiat text-sm tracking-wider">TECHSPARK 2K26</span>
              <span className="text-zinc-600">•</span>
              <span>Department of Information Science & Engineering</span>
            </div>
            <div>
              APS College of Engineering, Bengaluru • October 15, 2026
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
