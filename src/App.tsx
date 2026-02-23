/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Target, Trophy, AlertTriangle, Globe, Home, Github } from 'lucide-react';
import GameCanvas from './components/GameCanvas';
import { GameStatus, Language, Difficulty } from './types';
import { TRANSLATIONS, WIN_SCORE } from './constants';

export default function App() {
  const [status, setStatus] = useState<GameStatus>('START');
  const [lang, setLang] = useState<Language>('zh');
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');
  const [score, setScore] = useState(0);

  const t = TRANSLATIONS[lang];

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Header / HUD */}
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-50">{t.score}</span>
              <span className="font-mono text-xl font-bold leading-none">{score.toString().padStart(4, '0')}</span>
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-50">GOAL</span>
              <span className="font-mono text-xl font-bold leading-none">{WIN_SCORE}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-full transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <button 
            onClick={() => setStatus('START')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-full transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleLang}
            className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-full transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Game Area */}
      <main className="w-full h-screen flex items-center justify-center">
        <GameCanvas 
          status={status} 
          difficulty={difficulty}
          onScoreChange={setScore} 
          onStatusChange={setStatus} 
        />
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {status !== 'PLAYING' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
            >
              {status === 'START' && (
                <>
                  <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-blue-400" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">
                    {t.title}
                  </h1>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {t.objective}
                    <br />
                    <span className="text-sm opacity-70 mt-2 block italic">
                      {t.controls}
                    </span>
                  </p>

                  <div className="mb-8 text-left">
                    <div className="text-xs uppercase tracking-widest opacity-50 mb-4 text-center">{t.difficulty}</div>
                    <div className="grid grid-cols-1 gap-3">
                      {(['EASY', 'NORMAL', 'HARD'] as Difficulty[]).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`group relative flex flex-col items-start p-4 rounded-2xl border transition-all ${
                            difficulty === d
                              ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-600/10'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className={`font-bold uppercase tracking-tight ${difficulty === d ? 'text-blue-400' : 'text-gray-300'}`}>
                              {t[d.toLowerCase() as keyof typeof t]}
                            </span>
                            {difficulty === d && (
                              <motion.div layoutId="active-dot" className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                            {t[`${d.toLowerCase()}Desc` as keyof typeof t]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setStatus('PLAYING')}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                  >
                    {t.start}
                  </button>
                </>
              )}

              {status === 'WON' && (
                <>
                  <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-green-400" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase text-green-400">
                    {t.win}
                  </h1>
                  <div className="text-2xl font-mono mb-4">{t.score}: {score}</div>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    {t.winMsg}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setStatus('PLAYING')}
                      className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-green-600/20"
                    >
                      {t.restart}
                    </button>
                    <button 
                      onClick={() => setStatus('START')}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all active:scale-95"
                    >
                      {t.home}
                    </button>
                  </div>
                </>
              )}

              {status === 'LOST' && (
                <>
                  <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase text-red-400">
                    {t.loss}
                  </h1>
                  <div className="text-2xl font-mono mb-4">{t.score}: {score}</div>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    {t.lossMsg}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setStatus('PLAYING')}
                      className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-600/20"
                    >
                      {t.restart}
                    </button>
                    <button 
                      onClick={() => setStatus('START')}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all active:scale-95"
                    >
                      {t.home}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Mobile Hint */}
      <footer className="fixed bottom-4 left-0 w-full text-center pointer-events-none opacity-30">
        <p className="text-[10px] uppercase tracking-[0.3em]">© 2024 GALAXY DEFENSE COMMAND</p>
      </footer>
    </div>
  );
}
