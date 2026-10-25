"use client";
import { useEffect, useRef } from "react";

/**
 * A rotating 2D LiDAR-style sweep over a ground plane, drawn on a canvas:
 * range rings, two box obstacles and a wall segment return points as the beam
 * passes, then fade. Decorative only (aria-hidden); the figure it sits in
 * carries the text equivalent. Under reduced motion it draws one still frame.
 * It pauses off screen and in background tabs.
 */
type Point = { x: number; y: number; z: number; a: number };

function scene(): Point[] {
  const points: Point[] = [];
  const at = (x: number, y: number, z: number) => points.push({ x, y, z, a: Math.atan2(y, x) });
  // Ground returns on range rings, denser further out as a spinning sensor sees them.
  for (let r = 1; r <= 12; r++) {
    const n = Math.round(28 + r * 9);
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2 + r * 0.37;
      at(Math.cos(t) * r * 0.5, Math.sin(t) * r * 0.5, 0);
    }
  }
  // Two boxes and a wall: surfaces that face the sensor.
  const box = (cx: number, cy: number, w: number, d: number, h: number) => {
    for (let k = 0; k < 7; k++)
      for (let i = 0; i <= 10; i++) {
        const z = (k / 6) * h;
        at(cx - w / 2 + (i / 10) * w, cy - d / 2, z);
        at(cx - w / 2, cy - d / 2 + (i / 10) * d, z);
      }
  };
  box(2.1, 1.2, 0.9, 0.7, 0.9);
  box(-1.6, 2.3, 0.6, 0.6, 0.6);
  for (let k = 0; k < 9; k++) for (let i = 0; i <= 26; i++) at(-4 + (i / 26) * 3.6, -3.4 + (i / 26) * 0.9, (k / 8) * 1.2);
  return points;
}

export function ScanField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const points = scene();
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0, height = 0, frame = 0, visible = true, last = 0, sweep = 0.6, yaw = -0.5, tiltTarget = 0, tilt = 0;

    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width, height * 1.6) / 9.5;
      const cx = width * 0.52, cy = height * 0.5;
      const pitch = 0.95 + tilt * 0.12;
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw), cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      const project = (x: number, y: number, z: number) => {
        const rx = x * cosY - y * sinY, ry = x * sinY + y * cosY;
        const depth = ry * cosP - z * sinP, up = ry * sinP + z * cosP;
        const p = 7 / (7 + depth);
        return [cx + rx * scale * p, cy - up * scale * p, p] as const;
      };
      const [ox, oy] = project(0, 0, 0);
      // Sweep wedge: a soft amber fan trailing the beam across the ground.
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      for (let i = 0; i <= 16; i++) {
        const t = sweep - (i / 16) * 0.7;
        const [wx, wy] = project(Math.cos(t) * 6.2, Math.sin(t) * 6.2, 0);
        ctx.lineTo(wx, wy);
      }
      ctx.closePath();
      const fan = ctx.createRadialGradient(ox, oy, 0, ox, oy, scale * 6);
      fan.addColorStop(0, "rgba(245,183,0,0.22)");
      fan.addColorStop(1, "rgba(245,183,0,0.02)");
      ctx.fillStyle = fan;
      ctx.fill();
      // Beam: an amber line from the sensor to the edge of the range.
      const [bx, by] = project(Math.cos(sweep) * 6.2, Math.sin(sweep) * 6.2, 0);
      const beam = ctx.createLinearGradient(ox, oy, bx, by);
      beam.addColorStop(0, "rgba(245,183,0,0.95)");
      beam.addColorStop(1, "rgba(245,183,0,0.1)");
      ctx.strokeStyle = beam;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(bx, by);
      ctx.stroke();
      for (const pt of points) {
        let behind = sweep - pt.a;
        behind -= Math.floor(behind / (Math.PI * 2)) * Math.PI * 2;
        const glow = Math.exp(-behind / 1.6);
        const [px, py, p] = project(pt.x, pt.y, pt.z);
        const size = (pt.z > 0 ? 2.6 : 2) * p * (1 + glow * 0.5);
        if (glow > 0.3) ctx.fillStyle = `rgba(245,183,0,${(0.45 + glow * 0.55).toFixed(3)})`;
        else ctx.fillStyle = `rgba(206,222,244,${(0.42 + glow * 0.58).toFixed(3)})`;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }
      // Sensor: the robot at the origin, with a soft halo.
      const halo = ctx.createRadialGradient(ox, oy, 0, ox, oy, 18);
      halo.addColorStop(0, "rgba(245,183,0,0.5)");
      halo.addColorStop(1, "rgba(245,183,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(ox - 18, oy - 18, 36, 36);
      ctx.fillStyle = "#f5b700";
      ctx.fillRect(ox - 4, oy - 4, 8, 8);
    };

    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      sweep += dt * 1.35;
      yaw += dt * 0.05;
      tilt += (tiltTarget - tilt) * Math.min(dt * 3, 1);
      draw();
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && !still) { last = 0; frame = requestAnimationFrame(tick); }
    };

    resize();
    draw();
    const sizer = new ResizeObserver(() => { resize(); draw(); });
    sizer.observe(canvas);
    const watcher = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) start();
    });
    watcher.observe(canvas);
    const onVisibility = () => { if (!document.hidden) start(); };
    const onPointer = (e: PointerEvent) => { tiltTarget = e.clientY / innerHeight - 0.5; };
    document.addEventListener("visibilitychange", onVisibility);
    addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      sizer.disconnect();
      watcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
