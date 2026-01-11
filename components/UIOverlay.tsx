import React, { useState, useEffect } from 'react';
import { GameStatus } from '../types';
import { 
  Play, RotateCcw, ShieldAlert, Cpu, Eye, Zap, TrendingUp, 
  Github, Twitter, Linkedin, Youtube, Instagram, Menu, X, ArrowUp, Mail, Globe, ExternalLink, Box
} from 'lucide-react';

interface UIOverlayProps {
  status: GameStatus;
  score: number;
  lives: number;
  onStart: () => void;
  onRestart: () => void;
}

type ModalType = 'privacy' | 'terms' | null;

export const UIOverlay: React.FC<UIOverlayProps> = ({ status, score, lives, onStart, onRestart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const formattedScore = `Ξ ${score.toFixed(4)}`;

  // Handle scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.getElementById('landing-container');
      if (scrollContainer && scrollContainer.scrollTop > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    const container = document.getElementById('landing-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [status]);

  const scrollToTop = () => {
    const container = document.getElementById('landing-container');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const renderModal = () => {
    if (!activeModal) return null;
    
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-zinc-900/90 border border-green-500/30 rounded-xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scroll shadow-[0_0_50px_rgba(0,255,65,0.15)] transform transition-all scale-100 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
             <h3 className="text-2xl font-bold font-mono-code text-white flex items-center gap-2">
               <span className="w-2 h-6 bg-green-500 block"></span>
               {activeModal === 'privacy' ? 'PRIVACY POLICY' : 'TERMS OF SERVICE'}
             </h3>
             <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all">
               <X size={24} />
             </button>
          </div>
          
          <div className="space-y-4 text-gray-300 font-light leading-relaxed font-mono-code text-sm">
            {activeModal === 'privacy' ? (
              <>
                <p><span className="text-green-400">[DATA]</span> We do not collect any personal data. This game runs entirely client-side.</p>
                <p><span className="text-green-400">[STORAGE]</span> Local storage is used solely to persist your high score.</p>
                <p><span className="text-green-400">[TRACKING]</span> Zero cookies. Zero trackers. Pure code.</p>
                <p className="italic text-xs mt-4 opacity-50">Last Updated: 2025</p>
              </>
            ) : (
              <>
                <p><span className="text-green-400">[AGREEMENT]</span> By initiating the protocol, you accept the mission.</p>
                <p><span className="text-green-400">[ASSETS]</span> No real Ethereum is mined. This is a simulation.</p>
                <p><span className="text-green-400">[LIABILITY]</span> Developer assumes no responsibility for hardware damage due to rage clicks.</p>
              </>
            )}
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setActiveModal(null)}
              className="px-8 py-3 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/50 hover:border-green-400 font-bold rounded-lg transition-all btn-cyber uppercase tracking-widest text-sm"
            >
              ACKNOWLEDGE_PROTOCOL
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mock Data for "System Archive" (Portfolio)
  const portfolioItems = [
    { id: 1, title: 'AI NEXUS', category: 'Machine Learning', color: 'text-blue-400', border: 'hover:border-blue-500', bg: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]' },
    { id: 2, title: 'CYBER RACER', category: 'WebGL Game', color: 'text-purple-400', border: 'hover:border-purple-500', bg: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]' },
    { id: 3, title: 'DEFI VAULT', category: 'Fintech App', color: 'text-yellow-400', border: 'hover:border-yellow-500', bg: 'hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]' }
  ];

  // LANDING PAGE (MENU STATUS)
  if (status === GameStatus.MENU) {
    return (
      <div id="landing-container" className="absolute inset-0 z-30 overflow-y-auto overflow-x-hidden text-white scroll-smooth custom-scroll">
        
        {/* Modal */}
        {renderModal()}

        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/5 transition-all">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToTop()}>
               <div className="w-3 h-3 bg-green-500 rounded-full group-hover:shadow-[0_0_15px_#00ff41] transition-shadow"></div>
               <span className="font-bold text-xl tracking-tighter font-mono-code group-hover:text-green-400 transition-colors">BLOCK_HUNTER</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
               <a href="#how-it-works" className="hover:text-white transition-colors hover:translate-y-px text-shadow-sm">How It Works</a>
               <a href="#games" className="hover:text-white transition-colors hover:translate-y-px text-shadow-sm">Games</a>
               <a href="#lore" className="hover:text-white transition-colors hover:translate-y-px text-shadow-sm">Lore</a>
               <a href="#studio" className="hover:text-white transition-colors hover:translate-y-px text-shadow-sm">Studio</a>
               <button onClick={onStart} className="px-6 py-2 bg-green-500/10 border border-green-500/50 text-green-400 rounded-full hover:bg-green-500 hover:text-black transition-all font-mono-code font-bold btn-cyber backdrop-blur-sm">
                 PLAY NOW
               </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 border-b border-white/10 backdrop-blur-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 shadow-2xl">
               <a href="#how-it-works" onClick={handleNavClick} className="text-xl text-gray-300 hover:text-green-400 font-light border-b border-white/5 pb-2">How It Works</a>
               <a href="#games" onClick={handleNavClick} className="text-xl text-gray-300 hover:text-green-400 font-light border-b border-white/5 pb-2">Games</a>
               <a href="#lore" onClick={handleNavClick} className="text-xl text-gray-300 hover:text-green-400 font-light border-b border-white/5 pb-2">Lore</a>
               <a href="#studio" onClick={handleNavClick} className="text-xl text-gray-300 hover:text-green-400 font-light border-b border-white/5 pb-2">Studio</a>
               <button onClick={() => { handleNavClick(); onStart(); }} className="w-full py-4 bg-green-600 text-black font-bold rounded-lg mt-2 font-mono-code hover:bg-green-500 transition-colors btn-cyber">
                 INITIALIZE GAME
               </button>
            </div>
          )}
        </nav>

        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center relative p-6 pt-24 cyber-grid-bg">
          
          <div className="relative z-10 max-w-5xl w-full text-center space-y-10 animate-in fade-in zoom-in-95 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-black/40 backdrop-blur-md animate-float">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono-code text-green-400 tracking-wider">SYSTEM ONLINE v2.4.0</span>
            </div>

            <div className="relative">
               <h1 data-text="BLOCK_HUNTER" className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-green-100 to-green-900 drop-shadow-[0_0_30px_rgba(0,255,65,0.4)] leading-tight select-none glitch-text pb-4">
                BLOCK_HUNTER
              </h1>
            </div>
            
            <p className="text-lg md:text-2xl text-green-100/80 max-w-2xl mx-auto font-light leading-relaxed px-4 text-shadow-sm">
              High-Frequency Crypto-Mining Simulator. <br/>
              <span className="text-green-400 font-mono-code bg-green-500/10 px-2 rounded backdrop-blur-sm">Identify. Execute. Scale.</span>
            </p>

            <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={onStart}
                className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-bold text-xl rounded-full hover:bg-green-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,65,0.6)] w-full md:w-auto justify-center btn-cyber"
              >
                <span>INITIALIZE MINER</span>
                <Play className="w-5 h-5 fill-current group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
             <div className="mt-4 text-xs text-white/50 font-mono-code opacity-80">POWERED BY DEVIL LABS</div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center animate-bounce opacity-50 pointer-events-none">
            <span className="text-xs font-mono-code tracking-widest text-white">SCROLL FOR INTEL</span>
          </div>
        </section>

        {/* HOW IT WORKS / CARDS SECTION */}
        <section id="how-it-works" className="min-h-[80vh] bg-black/40 backdrop-blur-lg border-t border-white/5 relative z-20 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-mono-code glitch-text text-white" data-text="SYSTEM_MECHANICS">SYSTEM_MECHANICS</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto rounded-full shadow-[0_0_10px_#00ff41]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group bg-zinc-900/30 border border-white/10 p-8 rounded-2xl hover:border-green-500/50 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-green-500/20">
                  <Eye size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 font-mono-code text-white group-hover:text-green-300 transition-colors">1. IDENTIFY</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base relative z-10">
                  Scan the falling data stream. Target valid hashes beginning with the golden sequence <span className="text-yellow-400 font-mono-code bg-yellow-400/10 px-1 rounded border border-yellow-400/20">0000</span>.
                </p>
                <div className="mt-6 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-green-500 group-hover:w-full transition-all duration-1000 ease-out shadow-[0_0_10px_#00ff41]"></div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group bg-zinc-900/30 border border-white/10 p-8 rounded-2xl hover:border-blue-500/50 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 border border-blue-500/20">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 font-mono-code text-white group-hover:text-blue-300 transition-colors">2. EXECUTE</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base relative z-10">
                  Precision is key. Mine valid blocks instantly. Clicking corrupted data results in immediate penalty and <span className="text-red-400">firewall breach</span>.
                </p>
                <div className="mt-6 flex gap-2 justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500/20 animate-pulse delay-150"></div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group bg-zinc-900/30 border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 border border-purple-500/20">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 font-mono-code text-white group-hover:text-purple-300 transition-colors">3. SCALE</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base relative z-10">
                  Accumulate ETH. Utilize <span className="text-cyan-400 font-bold border-b border-cyan-400/50">FREEZE</span> power-ups. Survive increasing network entropy.
                </p>
                <div className="mt-6 flex items-end gap-1 h-8 justify-center">
                  <div className="w-1.5 h-3 bg-purple-500/30 group-hover:h-5 transition-all duration-300"></div>
                  <div className="w-1.5 h-5 bg-purple-500/50 group-hover:h-7 transition-all duration-300 delay-75"></div>
                  <div className="w-1.5 h-7 bg-purple-500/70 group-hover:h-9 transition-all duration-300 delay-100"></div>
                  <div className="w-1.5 h-9 bg-purple-500 group-hover:h-12 transition-all duration-300 delay-150 shadow-[0_0_10px_#a855f7]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM ARCHIVE (PORTFOLIO) */}
        <section id="games" className="py-24 px-6 relative z-20 bg-zinc-950/70 border-t border-white/5 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                   <h2 className="text-3xl md:text-5xl font-bold mb-2 font-mono-code text-white">SYSTEM_ARCHIVE</h2>
                   <p className="text-gray-400 font-mono-code text-sm">Deployments from the same developer.</p>
                </div>
                <a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 font-mono-code transition-colors group">
                   VIEW_FULL_DATABASE <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform"/>
                </a>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {portfolioItems.map((item) => (
                 <a 
                   key={item.id}
                   href="https://vickyiitp.tech"
                   target="_blank"
                   rel="noopener noreferrer"
                   className={`block bg-zinc-900/40 border border-white/10 rounded-xl p-6 group transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm ${item.border} ${item.bg}`}
                 >
                    <div className="flex justify-between items-start mb-4">
                       <div className={`p-3 rounded-lg bg-black/50 border border-white/5 ${item.color}`}>
                          <Box size={24} />
                       </div>
                       <ExternalLink size={16} className="text-gray-500 group-hover:text-white transition-colors"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-mono-code group-hover:text-green-400 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 font-mono-code mb-4">{item.category}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-400">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       OPERATIONAL
                    </div>
                 </a>
               ))}
             </div>
          </div>
        </section>

        {/* LORE SECTION */}
        <section id="lore" className="py-24 px-6 bg-gradient-to-b from-black/60 to-purple-950/20 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
             <div className="inline-block p-4 rounded-full bg-green-500/5 border border-green-500/20 mb-8 animate-float">
                <Cpu size={48} className="text-green-400" />
             </div>
             <h2 className="text-2xl md:text-4xl font-bold mb-8 font-mono-code text-white">THE GENESIS PROTOCOL</h2>
             <div className="relative">
                <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-green-500/30"></div>
                <div className="absolute -right-4 -bottom-4 w-8 h-8 border-b-2 border-r-2 border-green-500/30"></div>
                <p className="text-lg md:text-xl text-gray-200 leading-loose italic font-light font-mono-code">
                "In the year 2140, the last Bitcoin was mined. The world turned to the infinite shards of the lost Ethereum testnets. 
                You are a <span className="text-green-400 font-bold glow-text">Node Runner</span>. Your latency is your lifeline. 
                The stream is accelerating. The corruption is spreading. Can you find the golden blocks before the system crashes?"
                </p>
             </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="studio" className="py-16 border-t border-white/5 bg-black/80 text-center relative z-20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2 font-mono-code">Vickyiitp</h3>
                <p className="text-gray-400 text-sm max-w-xs">Building the future of web gaming and AI. <br/>Based in IIT Patna.</p>
              </div>
              
              <div className="flex gap-6">
                 <a href="https://linkedin.com/in/vickyiitp" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg" aria-label="LinkedIn">
                   <Linkedin className="w-5 h-5" />
                 </a>
                 <a href="https://twitter.com/vickyiitp" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-full hover:bg-sky-500 hover:text-white transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg" aria-label="Twitter">
                   <Twitter className="w-5 h-5" />
                 </a>
                 <a href="https://github.com/vickyiitp" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-full hover:bg-gray-700 hover:text-white transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg" aria-label="GitHub">
                   <Github className="w-5 h-5" />
                 </a>
                 <a href="https://youtube.com/@vickyiitp" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg" aria-label="YouTube">
                   <Youtube className="w-5 h-5" />
                 </a>
                 <a href="https://instagram.com/vickyiitp" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-full hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg" aria-label="Instagram">
                   <Instagram className="w-5 h-5" />
                 </a>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 border-t border-white/5 pt-8 text-sm text-gray-500">
               <div className="flex flex-col gap-2 text-left">
                 <div className="flex items-center gap-2 hover:text-green-400 transition-colors cursor-pointer group">
                   <Mail size={14} className="group-hover:text-green-500"/>
                   <a href="mailto:themvaplatform@gmail.com">themvaplatform@gmail.com</a>
                 </div>
                 <div className="flex items-center gap-2 hover:text-green-400 transition-colors cursor-pointer group">
                   <Globe size={14} className="group-hover:text-green-500" />
                   <a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer">vickyiitp.tech</a>
                 </div>
               </div>

               <div className="text-center md:text-center">
                 <p>© 2025 Vickyiitp. All Rights Reserved.</p>
                 <p className="text-xs mt-1 text-gray-600">Devil Labs Production</p>
               </div>

               <div className="flex justify-center md:justify-end gap-6">
                 <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                 <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms of Service</button>
               </div>
            </div>
          </div>
        </footer>
        
        {/* Back To Top Button */}
        {showBackToTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-green-500 text-black rounded-full shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:bg-white transition-all animate-in slide-in-from-bottom-4 hover:-translate-y-1"
            aria-label="Back to top"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </div>
    );
  }

  // GAME OVER OVERLAY
  if (status === GameStatus.GAME_OVER) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-zinc-950/90 border border-red-500 p-8 rounded-xl text-center max-w-md w-full shadow-[0_0_100px_rgba(255,0,0,0.3)] animate-in zoom-in-95 duration-300 relative overflow-hidden backdrop-blur-xl">
             {/* Red Glitch Background */}
            <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>

            <ShieldAlert size={64} className="mx-auto text-red-500 mb-6 animate-pulse" />
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 font-mono-code mb-2 glitch-text" data-text="CRITICAL_FAIL">CRITICAL_FAIL</h2>
            <div className="text-red-300/60 text-sm font-mono-code mb-8">CONNECTION TERMINATED BY HOST</div>
            
            <div className="bg-red-950/30 p-6 rounded-lg border border-red-500/30 mb-8 relative group">
              <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-xs text-red-400 uppercase tracking-widest mb-2">Final Yield Mined</div>
              <div className="text-4xl font-bold text-yellow-400 font-mono-code text-glow">{formattedScore}</div>
            </div>

            <button 
              onClick={onRestart}
              className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-mono-code font-bold text-xl rounded-lg transition-all w-full flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] btn-cyber"
            >
              <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
              <span>REBOOT_SYSTEM()</span>
            </button>
        </div>
      </div>
    );
  }

  // HUD (PLAYING STATUS)
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20">
      <div className="flex justify-between items-start w-full max-w-7xl mx-auto">
        {/* Score */}
        <div className="bg-black/40 border border-green-500/30 p-3 md:p-4 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,255,65,0.1)] min-w-[140px] transform transition-transform hover:scale-105">
          <div className="text-[10px] text-green-400/80 uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
             ETH Wallet
          </div>
          <div className="text-2xl md:text-4xl font-bold text-yellow-400 font-mono-code tabular-nums text-glow">
            {formattedScore}
          </div>
        </div>

        {/* Lives */}
        <div className="flex gap-2">
           {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className={`w-3 h-8 md:w-4 md:h-12 border border-green-500/50 rounded skew-x-12 transition-all duration-300 ${i < lives ? 'bg-green-500 shadow-[0_0_15px_rgba(0,255,65,0.6)]' : 'bg-transparent opacity-20 scale-90'}`} />
           ))}
        </div>
      </div>

      <div className="text-center pb-4 opacity-80 text-[10px] md:text-xs text-green-400 font-mono-code tracking-widest animate-pulse text-shadow-sm">
         // MINE: [0000...] // AVOID: [CORRUPT]
      </div>
    </div>
  );
};