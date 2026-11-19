"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Expert {
  id: string;
  name: string;
  role: string;
  expertise: "FRONTEND" | "DATABASE" | "DEVOPS" | "ALL";
  avatar: string;
  status: "IDLE" | "ASSIGNED";
  targetBottleneckId?: string | null;
}

interface Bottleneck {
  id: string;
  title: string;
  description: string;
  type: "FRONTEND" | "DATABASE" | "DEVOPS" | "BACKEND";
  timeLimit: number; // seconds total
  timeLeft: number;  // seconds left
  progress: number;  // 0 to 100
  assignedExpertId?: string | null;
}

const EXPERTS_DATA: Expert[] = [
  {
    id: "alex",
    name: "Alex Rivera",
    role: "Senior React & Next.js Engineer",
    expertise: "FRONTEND",
    avatar: "👨‍💻",
    status: "IDLE",
  },
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "Database DBA & Backend Architect",
    expertise: "DATABASE",
    avatar: "👩‍💻",
    status: "IDLE",
  },
  {
    id: "david",
    name: "David Vance",
    role: "DevOps & AWS Amplify Architect",
    expertise: "DEVOPS",
    avatar: "⚙️",
    status: "IDLE",
  },
];

const BOTTLENECK_TEMPLATES = [
  {
    title: "Cumulative Layout Shift (CLS) Penalty",
    description: "External logo URLs are causing layout shifts and penalizing SEO rankings.",
    type: "FRONTEND" as const,
    timeLimit: 18,
  },
  {
    title: "Neon Handshake Rejected",
    description: "Database connection pools are failing. SSL pooler modifiers are missing.",
    type: "DATABASE" as const,
    timeLimit: 20,
  },
  {
    title: "AWS Amplify preBuild Failure",
    description: "SSR environment variables are missing in the build-time generation config.",
    type: "DEVOPS" as const,
    timeLimit: 16,
  },
  {
    title: "Unsanitized Blog contentHtml Rendering",
    description: "Raw typography layouts look broken, and header text colors are incorrect.",
    type: "FRONTEND" as const,
    timeLimit: 15,
  },
  {
    title: "PostgreSQL Pool Connection Starvation",
    description: "High concurrency traffic is causing database queries to queue up and timeout.",
    type: "DATABASE" as const,
    timeLimit: 22,
  },
  {
    title: "S3 Attachment Upload Handshake Fail",
    description: "Conditionally loaded cloud storage adapter is failing due to missing S3_BUCKET env.",
    type: "DEVOPS" as const,
    timeLimit: 19,
  },
];

export default function RescueMissionGame() {
  const [gameState, setGameState] = useState<"START" | "PLAYING" | "SUCCESS" | "FAILED">("START");
  const [projectProgress, setProjectProgress] = useState(0); // 0 to 100%
  const [budget, setBudget] = useState(60000); // $60k
  const [health, setHealth] = useState(100); // 100%
  const [experts, setExperts] = useState<Expert[]>(EXPERTS_DATA);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimerRef = useRef<number>(0);

  // Initialize Game
  const startGame = () => {
    setProjectProgress(0);
    setBudget(60000);
    setHealth(100);
    setExperts(EXPERTS_DATA.map(e => ({ ...e, status: "IDLE", targetBottleneckId: null })));
    setSelectedExpertId(null);
    setScore(0);
    
    // Spawn two initial bottlenecks
    const initial1 = createBottleneck(0);
    const initial2 = createBottleneck(1);
    setBottlenecks([initial1, initial2]);
    spawnTimerRef.current = 0;
    setGameState("PLAYING");
  };

  // Helper to spawn a bottleneck
  const createBottleneck = (index?: number): Bottleneck => {
    const templateIdx = index !== undefined ? index : Math.floor(Math.random() * BOTTLENECK_TEMPLATES.length);
    const template = BOTTLENECK_TEMPLATES[templateIdx];
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: template.title,
      description: template.description,
      type: template.type,
      timeLimit: template.timeLimit,
      timeLeft: template.timeLimit,
      progress: 0,
      assignedExpertId: null,
    };
  };

  // Assign selected expert to a bottleneck
  const assignExpert = (bottleneckId: string) => {
    if (!selectedExpertId) return;

    // Check if the expert is already working somewhere
    const currentExpert = experts.find(e => e.id === selectedExpertId);
    if (!currentExpert) return;

    setBottlenecks(prev => prev.map(bn => {
      // If the expert was already assigned to this bottleneck, keep it
      // If the expert is being assigned to a new bottleneck:
      if (bn.id === bottleneckId) {
        // If this bottleneck already has an expert, return that expert to idle
        if (bn.assignedExpertId) {
          freeUpExpert(bn.assignedExpertId);
        }
        return { ...bn, assignedExpertId: selectedExpertId };
      }
      // Remove this expert from any other bottleneck they were assigned to
      if (bn.assignedExpertId === selectedExpertId) {
        return { ...bn, assignedExpertId: null };
      }
      return bn;
    }));

    // Update Expert's status
    setExperts(prev => prev.map(e => {
      if (e.id === selectedExpertId) {
        return { ...e, status: "ASSIGNED", targetBottleneckId: bottleneckId };
      }
      // If another expert was at the target bottleneck, free them up
      const targetBn = bottlenecks.find(b => b.id === bottleneckId);
      if (targetBn && targetBn.assignedExpertId === e.id) {
        return { ...e, status: "IDLE", targetBottleneckId: null };
      }
      return e;
    }));

    setSelectedExpertId(null);
  };

  const freeUpExpert = (expertId: string) => {
    setExperts(prev => prev.map(e => {
      if (e.id === expertId) {
        return { ...e, status: "IDLE", targetBottleneckId: null };
      }
      return e;
    }));
  };

  // Main Game Loop (1s intervals)
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    gameTimerRef.current = setInterval(() => {
      // 1. Tick down budget (baseline burn rate + penalty for unresolved issues)
      setBudget(prev => {
        const cost = 250 + (bottlenecks.length * 100);
        const next = prev - cost;
        if (next <= 0) {
          setGameState("FAILED");
          return 0;
        }
        return next;
      });

      // 2. Increment project progress (base rate + bonus per active resolution)
      setProjectProgress(prev => {
        let increment = 1.0; // baseline progress 1%
        
        // Add progress based on active work
        bottlenecks.forEach(bn => {
          if (bn.assignedExpertId) {
            const expert = experts.find(e => e.id === bn.assignedExpertId);
            const isMatch = expert && (expert.expertise === bn.type || (bn.type === "BACKEND" && (expert.expertise === "DATABASE" || expert.expertise === "FRONTEND")));
            increment += isMatch ? 2.5 : 1.2;
          }
        });

        const next = prev + increment;
        if (next >= 100) {
          setGameState("SUCCESS");
          return 100;
        }
        return next;
      });

      // 3. Process bottlenecks
      setBottlenecks(prev => {
        const updated = prev.map(bn => {
          let nextTime = bn.timeLeft - 1;
          let nextProgress = bn.progress;

          // If an expert is assigned, increase resolution progress
          if (bn.assignedExpertId) {
            const expert = experts.find(e => e.id === bn.assignedExpertId);
            const isMatch = expert && (expert.expertise === bn.type || (bn.type === "BACKEND" && (expert.expertise === "DATABASE" || expert.expertise === "FRONTEND")));
            const workAmount = isMatch ? 25 : 12; // MATCH speeds up resolution significantly
            nextProgress = Math.min(100, nextProgress + workAmount);
          }

          return {
            ...bn,
            timeLeft: nextTime,
            progress: nextProgress,
          };
        });

        // Detect expired or completed bottlenecks
        const resolved: string[] = [];
        const expired: string[] = [];

        const filtered = updated.filter(bn => {
          if (bn.progress >= 100) {
            resolved.push(bn.id);
            if (bn.assignedExpertId) freeUpExpert(bn.assignedExpertId);
            return false;
          }
          if (bn.timeLeft <= 0) {
            expired.push(bn.id);
            if (bn.assignedExpertId) freeUpExpert(bn.assignedExpertId);
            return false;
          }
          return true;
        });

        // Trigger effects for resolved/expired
        if (resolved.length > 0) {
          setScore(s => s + resolved.length * 1000);
          setBudget(b => Math.min(100000, b + resolved.length * 3000)); // cash bonus for high quality release
        }

        if (expired.length > 0) {
          setHealth(h => {
            const nextH = h - (expired.length * 15);
            if (nextH <= 0) {
              setGameState("FAILED");
              return 0;
            }
            return nextH;
          });
          setBudget(b => Math.max(0, b - expired.length * 6000)); // severe operational penalty
        }

        return filtered;
      });

      // 4. Spawn new bottlenecks periodically
      spawnTimerRef.current += 1;
      if (spawnTimerRef.current >= 7) {
        spawnTimerRef.current = 0;
        setBottlenecks(prev => {
          if (prev.length < 3) {
            return [...prev, createBottleneck()];
          }
          return prev;
        });
      }

    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [gameState, bottlenecks, experts]);

  // Clean up selected state if an assigned expert becomes idle
  const handleSelectExpert = (expertId: string) => {
    const expert = experts.find(e => e.id === expertId);
    if (!expert) return;

    if (expert.status === "ASSIGNED") {
      // Recall the expert instantly to idle pool
      const targetBnId = expert.targetBottleneckId;
      setBottlenecks(prev => prev.map(bn => {
        if (bn.id === targetBnId) {
          return { ...bn, assignedExpertId: null };
        }
        return bn;
      }));
      freeUpExpert(expertId);
      setSelectedExpertId(null);
    } else {
      setSelectedExpertId(prev => prev === expertId ? null : expertId);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#FAFBF7] to-white min-h-[85vh] flex items-center justify-center font-sans">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-jway-green font-bold text-xs uppercase tracking-widest bg-jway-green/10 px-3 py-1 rounded-full">
            Staff Augmentation Showcase
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-800">
            Project <span className="text-jway-green">Rescue Mission</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            You are the Director of Engineering. Your legacy integration is throwing alarms. Assign the right JWay Experts to solve bottlenecks before your health drops to 0!
          </p>
        </div>

        {/* Start Game View */}
        {gameState === "START" && (
          <div className="max-w-2xl mx-auto bg-white border border-gray-100 shadow-2xl rounded-3xl p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-jway-green/5 rounded-full blur-2xl"></div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-jway-green/10 text-jway-green mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Mission Parameters</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                Every second, your project burns cash. High-severity bottlenecks will spawn. Match your specialists to the issues to launch the project at 100% progress.
              </p>
            </div>

            {/* Mechanics Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-y border-gray-100 py-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">1. Select Expert</span>
                <p className="text-xs text-gray-600">Click a JWay expert from the pool to prep them.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">2. Assign and Fix</span>
                <p className="text-xs text-gray-600">Click any open ticket. Matching roles resolves it 2x faster.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">3. Deploy Project</span>
                <p className="text-xs text-gray-600">Reach 100% progress before budget or health hits zero.</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 rounded-xl bg-jway-green text-white font-extrabold hover:bg-jway-green/90 transition-all text-base shadow-xl shadow-jway-green/20 hover:scale-[1.02]"
            >
              Start Rescue Mission
            </button>
          </div>
        )}

        {/* Game Playing View */}
        {gameState === "PLAYING" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Stats and Experts Pool */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Telemetry Dashboard */}
              <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl space-y-4 border border-gray-800">
                <h3 className="text-xs font-extrabold text-jway-green uppercase tracking-widest border-b border-gray-800 pb-2">
                  System Telemetry
                </h3>
                
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>PROJECT PROGRESS</span>
                    <span className="text-jway-green">{Math.floor(projectProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-jway-green h-full rounded-full transition-all duration-300"
                      style={{ width: `${projectProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Budget Gauge */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs font-bold text-gray-400">BURNING BUDGET:</span>
                  <span className={`text-lg font-black ${budget < 20000 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    ${budget.toLocaleString()}
                  </span>
                </div>

                {/* Health Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>INFRASTRUCTURE HEALTH</span>
                    <span className={health < 40 ? 'text-red-500 animate-pulse' : 'text-gray-200'}>
                      {health}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        health < 40 ? 'bg-red-500' : 'bg-[#a8c028]'
                      }`}
                      style={{ width: `${health}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* JWay Specialists Standby Pool */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <h3 className="text-sm font-bold text-gray-800">JWay Expert Pool</h3>
                  <span className="text-xs font-bold text-gray-400">Click to Select</span>
                </div>

                <div className="space-y-3">
                  {experts.map(exp => {
                    const isSelected = selectedExpertId === exp.id;
                    const isAssigned = exp.status === "ASSIGNED";
                    return (
                      <button
                        key={exp.id}
                        onClick={() => handleSelectExpert(exp.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 relative group ${
                          isSelected 
                            ? 'border-jway-green bg-jway-green/5 shadow-md shadow-jway-green/5' 
                            : isAssigned
                              ? 'border-blue-100 bg-blue-50/20 opacity-80'
                              : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="text-2xl">{exp.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 text-sm truncate">{exp.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{exp.role}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-200/60 text-gray-600">
                            {exp.expertise} Expert
                          </span>
                        </div>

                        {/* Status indicators */}
                        {isAssigned ? (
                          <div className="text-xs font-bold text-blue-600 flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                            Active
                          </div>
                        ) : isSelected ? (
                          <div className="text-xs font-bold text-jway-green shrink-0">
                            Ready
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 group-hover:text-gray-600 shrink-0">
                            Idle
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Active Bottleneck Monitor */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-6">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Active Bottlenecks Monitor</h3>
                    <p className="text-xs text-gray-500">Select a JWay specialist on the left, then click a ticket below to assign them.</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 shrink-0">
                    Alarms Active: {bottlenecks.length}
                  </span>
                </div>

                {bottlenecks.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <p className="font-bold text-gray-700 text-sm">System Running Smoothly</p>
                    <p className="text-xs text-gray-400 max-w-xs">All bottlenecks resolved! Monitoring the stream for new anomalies...</p>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1">
                    {bottlenecks.map(bn => {
                      const hasAssigned = !!bn.assignedExpertId;
                      const expert = hasAssigned ? experts.find(e => e.id === bn.assignedExpertId) : null;
                      const isMatch = expert && (expert.expertise === bn.type || (bn.type === "BACKEND" && (expert.expertise === "DATABASE" || expert.expertise === "FRONTEND")));

                      return (
                        <div
                          key={bn.id}
                          className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            hasAssigned
                              ? 'border-blue-100 bg-blue-50/10'
                              : 'border-red-100 bg-red-50/10'
                          }`}
                        >
                          {/* Alert Background Pulse for low time */}
                          {!hasAssigned && bn.timeLeft < 6 && (
                            <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>
                          )}

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                bn.type === "FRONTEND" ? "bg-amber-100 text-amber-800" :
                                bn.type === "DATABASE" ? "bg-blue-100 text-blue-800" :
                                bn.type === "DEVOPS" ? "bg-purple-100 text-purple-800" :
                                "bg-teal-100 text-teal-800"
                              }`}>
                                {bn.type}
                              </span>
                              <span className={`text-xs font-bold ${bn.timeLeft < 6 ? 'text-red-500 font-extrabold animate-pulse' : 'text-gray-500'}`}>
                                ⚠️ Expires in {bn.timeLeft}s
                              </span>
                            </div>

                            <h4 className="font-bold text-gray-800 text-sm leading-snug">{bn.title}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-lg">{bn.description}</p>

                            {/* Resolution Progress Bar */}
                            {hasAssigned && (
                              <div className="space-y-1 pt-1">
                                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                  <span>RESOLVING BY {expert?.name.toUpperCase()} {isMatch && "🎯 SPEED BOOST!"}</span>
                                  <span>{bn.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      isMatch ? 'bg-jway-green' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${bn.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0 w-full sm:w-auto">
                            {hasAssigned ? (
                              <button
                                onClick={() => handleSelectExpert(bn.assignedExpertId!)}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-blue-200 text-blue-600 bg-white font-bold hover:bg-blue-50 transition-all text-xs flex items-center justify-center gap-1.5"
                              >
                                <span>Recall Expert</span>
                              </button>
                            ) : (
                              <button
                                disabled={!selectedExpertId}
                                onClick={() => assignExpert(bn.id)}
                                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 ${
                                  selectedExpertId
                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/10'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <span>Assign Expert</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* End Game Success View */}
        {gameState === "SUCCESS" && (
          <div className="max-w-2xl mx-auto bg-white border border-gray-100 shadow-2xl rounded-3xl p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 text-green-500 mb-4 animate-bounce">
                🏆
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-800">Project Launched Successfully!</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                Excellent management! You leveraged the matching JWay specialists to deploy the codebase on time.
              </p>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-6 max-w-md mx-auto">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Remaining Cash</span>
                <p className="text-lg font-black text-jway-green">${budget.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">System Health</span>
                <p className="text-lg font-black text-jway-green">{health}%</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={startGame}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm"
              >
                Play Again
              </button>
              <Link
                href="/contact-us"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-jway-green text-white font-extrabold hover:bg-jway-green/90 transition-all text-sm shadow-lg shadow-jway-green/15"
              >
                Augment Your Real Team
              </Link>
            </div>
          </div>
        )}

        {/* End Game Failed View */}
        {gameState === "FAILED" && (
          <div className="max-w-2xl mx-auto bg-white border border-gray-100 shadow-2xl rounded-3xl p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 text-red-500 mb-4">
                💥
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-800">Project Red-Lined</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                {budget <= 0 ? (
                  "The project ran out of budget before completion. Finding and managing candidates yourself is costly."
                ) : (
                  "Infrastructure health hit 0%. Codebase instabilities and bugs caused a release failure."
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={startGame}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm"
              >
                Try Again
              </button>
              <Link
                href="/contact-us"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-jway-green text-white font-extrabold hover:bg-jway-green/90 transition-all text-sm shadow-lg shadow-jway-green/15"
              >
                Get JWay to Help Now
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
