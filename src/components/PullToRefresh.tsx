"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";

interface PullToRefreshProps {
  onRefresh: () => void;
  refreshing: boolean;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, refreshing, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [pullState, setPullState] = useState<"idle" | "pulling" | "threshold" | "refreshing" | "done">("idle");
  const { t } = useI18n();

  // Refs for values the touch handlers need — keeps callbacks stable
  // so event listeners aren't re-registered mid-gesture
  const pullStateRef = useRef(pullState);
  const pullDistanceRef = useRef(pullDistance);
  const refreshingRef = useRef(refreshing);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { pullStateRef.current = pullState; }, [pullState]);
  useEffect(() => { pullDistanceRef.current = pullDistance; }, [pullDistance]);
  useEffect(() => { refreshingRef.current = refreshing; }, [refreshing]);

  const THRESHOLD = 80;
  const MAX_PULL = 160;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY > 0 || refreshingRef.current || pullStateRef.current === "refreshing") return;
    startY.current = e.touches[0].clientY;
    setPullDistance(0);
    setPullState("pulling");
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const currentState = pullStateRef.current;
    if (currentState === "idle" || currentState === "refreshing" || currentState === "done" || refreshingRef.current) return;

    const currentY = e.touches[0].clientY;
    const raw = currentY - startY.current;
    if (raw <= 0) {
      setPullDistance(0);
      setPullState("idle");
      return;
    }

    // Rubber-band damping for smooth feel
    const damped = raw > 100 ? 100 + (raw - 100) * 0.3 : raw;
    const clamped = Math.min(damped, MAX_PULL);

    setPullDistance(clamped);

    if (clamped >= THRESHOLD && raw >= THRESHOLD) {
      setPullState("threshold");
    } else {
      setPullState("pulling");
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const currentState = pullStateRef.current;
    const currentDistance = pullDistanceRef.current;
    if (currentState === "refreshing" || currentState === "done" || currentState === "idle") return;

    if (currentDistance >= THRESHOLD && currentState === "threshold") {
      setPullDistance(THRESHOLD);
      setPullState("refreshing");
      onRefresh();
    } else {
      setPullState("idle");
      setPullDistance(0);
    }
  }, [onRefresh]);

  // Always attach listeners once (stable callbacks)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Detect when refreshing finishes → show done state
  useEffect(() => {
    if (!refreshing && pullState === "refreshing") {
      setPullState("done");
      const timer = setTimeout(() => {
        setPullState("idle");
        setPullDistance(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [refreshing, pullState]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const arrowRotation = pullDistance * 2.5;

  const getIndicatorText = () => {
    if (pullState === "refreshing") return t("pullToRefresh.refreshing");
    if (pullState === "done") return t("pullToRefresh.updated");
    if (pullState === "threshold") {
      return t("pullToRefresh.release");
    }
    return t("pullToRefresh.pull");
  };

  return (
    <div
      ref={containerRef}
      className="relative overscroll-contain touch-pan-y"
    >
      {/* Pull indicator — rendered above content with absolute positioning */}
      <div
        className="absolute left-0 right-0 flex items-start justify-center pointer-events-none z-50"
        style={{
          top: 0,
          height: `${pullDistance + 20}px`,
          opacity: Math.min(pullDistance / 20, 1),
          transition: pullState === "idle" || pullState === "done"
            ? "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "none",
        }}
      >
        <div className="flex flex-col items-center gap-1 pt-2">
          {/* ── Cute animated indicator ── */}
          <div className="relative">
            {pullState === "refreshing" ? (
              /* Bouncing sun with spinning rays */
              <div className="flex flex-col items-center">
                <svg width="44" height="44" viewBox="0 0 44 44" className="drop-shadow-lg">
                  <defs>
                    <radialGradient id="refreshGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="22" cy="22" r="20" fill="url(#refreshGlow)" className="animate-ping" style={{ animationDuration: "1.5s" }} />
                  <g className="origin-center animate-[spin_1s_linear_infinite]">
                    <circle cx="22" cy="22" r="12" fill="#FBBF24" />
                    {/* Cute smiley face */}
                    <circle cx="18" cy="20" r="1.8" fill="#92400E" />
                    <circle cx="26" cy="20" r="1.8" fill="#92400E" />
                    <path d="M17 26 Q22 30 27 26" stroke="#92400E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    {/* Blush */}
                    <ellipse cx="14" cy="23" rx="2.5" ry="1.2" fill="#FCA5A5" opacity="0.5" />
                    <ellipse cx="30" cy="23" rx="2.5" ry="1.2" fill="#FCA5A5" opacity="0.5" />
                  </g>
                </svg>
              </div>
            ) : pullState === "done" ? (
              /* Green checkmark */
              <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-lg animate-bounce">
                <circle cx="20" cy="20" r="18" fill="#4ADE80" opacity="0.15" />
                <circle cx="20" cy="20" r="14" fill="#4ADE80" />
                <path d="M12 20 L18 26 L28 16" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              /* Progress circle + arrow */
              <div
                className="transition-transform duration-100 ease-out"
                style={{ transform: `rotate(${arrowRotation}deg)` }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" className="drop-shadow-lg">
                  {/* Background ring */}
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="2.5"
                    className="dark:stroke-gray-600"
                    opacity="0.4"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    stroke={pullState === "threshold" ? "#3B82F6" : "#60A5FA"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress)}`}
                    className="transition-[stroke-dashoffset] duration-100"
                    transform="rotate(-90 18 18)"
                  />
                  {/* Arrow */}
                  {pullState === "threshold" ? (
                    <g className="animate-bounce" style={{ animationDuration: "0.6s" }}>
                      <path d="M18 8 L18 24 M12 18 L18 24 L24 18" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  ) : (
                    <>
                      <path d="M18 10 L18 24 M12 18 L18 24 L24 18" stroke="#60A5FA" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Subtle sun rays */}
                      <g opacity="0.3" className="origin-center" style={{ transform: `rotate(${arrowRotation}deg)` }}>
                        {[0, 60, 120, 180, 240, 300].map((angle) => (
                          <line
                            key={angle}
                            x1="18" y1="5" x2="18" y2="8"
                            stroke="#FBBF24"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            transform={`rotate(${angle} 18 18)`}
                          />
                        ))}
                      </g>
                    </>
                  )}
                </svg>
              </div>
            )}
          </div>

          {/* Text label */}
          <span
            className={`
              text-xs font-semibold tracking-wide select-none whitespace-nowrap
              ${pullState === "refreshing"
                ? "text-blue-500 dark:text-blue-400 animate-pulse"
                : pullState === "threshold"
                  ? "text-blue-600 dark:text-blue-300"
                  : pullState === "done"
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
              }
            `}
          >
            {getIndicatorText()}
          </span>
        </div>
      </div>

      {/* Content wrapper — translated down to reveal indicator */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullState === "idle" || pullState === "done"
            ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
