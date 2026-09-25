'use client';

import { useEffect, useRef } from 'react';

export default function AmberCursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const dot = dotRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;
    if (!wrapper || !dot || !follower || !label) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let prevFollowerX = mouseX;
    let prevFollowerY = mouseY;
    let targetX = mouseX;
    let targetY = mouseY;
    let isVisible = false;
    let isHovered = false;
    let magneticTarget: HTMLElement | null = null;
    let animId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        wrapper.style.opacity = '1';
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const handleMouseLeave = () => {
      wrapper.style.opacity = '0';
      isVisible = false;
    };

    const handleMouseEnter = () => {
      wrapper.style.opacity = '1';
      isVisible = true;
    };

    const handleMouseDown = (e: MouseEvent) => {
      follower.classList.add('is-clicking');
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      wrapper.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    };

    const handleMouseUp = () => {
      follower.classList.remove('is-clicking');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const setupInteractiveHover = () => {
      const targets = document.querySelectorAll('a, button, [data-cursor], .intel-card, input');
      targets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          isHovered = true;
          follower.classList.add('is-hovering');
          const customText = el.getAttribute('data-cursor');
          if (customText) label.textContent = customText;
          else if (el.tagName === 'A') label.textContent = 'EXPLORE ↗';
          else if (el.tagName === 'BUTTON') label.textContent = 'SELECT';
          else label.textContent = 'VIEW';
          if (el.hasAttribute('data-magnetic')) magneticTarget = el as HTMLElement;
        });
        el.addEventListener('mouseleave', () => {
          isHovered = false;
          follower.classList.remove('is-hovering');
          magneticTarget = null;
        });
      });
    };

    setupInteractiveHover();

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        targetX = lerp(mouseX, centerX, 0.45);
        targetY = lerp(mouseY, centerY, 0.45);
      } else {
        targetX = mouseX;
        targetY = mouseY;
      }

      followerX = lerp(followerX, targetX, 0.18);
      followerY = lerp(followerY, targetY, 0.18);

      const dx = followerX - prevFollowerX;
      const dy = followerY - prevFollowerY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      prevFollowerX = followerX;
      prevFollowerY = followerY;

      let scaleX = 1;
      let scaleY = 1;
      let angle = 0;
      if (!prefersReducedMotion && !isHovered && speed > 0.8) {
        angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const stretch = Math.min(speed * 0.015, 0.3);
        scaleX = 1 + stretch;
        scaleY = Math.max(1 - stretch * 0.75, 0.75);
      }

      if (isHovered || prefersReducedMotion) {
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      } else {
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div id="amber-cursor-wrapper" ref={wrapperRef} className="opacity-0 transition-opacity duration-300">
      <div className="amber-follower" ref={followerRef}>
        <span className="amber-label" ref={labelRef}>VIEW</span>
      </div>
      <div className="amber-dot" ref={dotRef} />
    </div>
  );
}