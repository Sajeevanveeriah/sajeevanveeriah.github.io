"""Figures and checked numbers for the 30 October 2026 journal articles.

Run: python 20261030-Article-Figures-Rev00.py
Writes SVG and PNG charts beside this script and prints the computed values
as JSON (also saved to 20261030-Article-Figures-Rev00.json).
Needs numpy and matplotlib.
"""
import json
import math
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyBboxPatch

OUT = Path(__file__).resolve().parent
NAVY, AMBER, INK, GRID, BG = "#0F1E33", "#F5B700", "#56616d", "#d7dee5", "#fafbfc"
BLUE, RED = "#2f6fb2", "#b5452b"
plt.rcParams.update({
    "font.size": 13, "axes.edgecolor": INK, "axes.labelcolor": INK,
    "xtick.color": INK, "ytick.color": INK, "axes.titlecolor": NAVY,
    "axes.titleweight": "bold", "axes.titlesize": 17, "svg.fonttype": "path",
})
results = {}


def figure():
    fig, ax = plt.subplots(figsize=(12, 7.2), facecolor=BG)
    ax.set_facecolor(BG)
    ax.grid(True, color=GRID, linewidth=0.8)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    return fig, ax


def save(fig, stem):
    fig.tight_layout()
    fig.savefig(OUT / f"{stem}.svg", facecolor=BG, metadata={"Date": None})
    fig.savefig(OUT / f"{stem}.png", dpi=100, facecolor=BG)
    plt.close(fig)


# 1. Odometry: unequal wheel diameters on a differential-drive robot.
# Left and right wheels travel s(1 - e/2) and s(1 + e/2); heading changes by e*ds/b.
b = 0.30  # wheelbase, m
s = np.linspace(0, 20, 2001)
ds = s[1] - s[0]
fig, ax = figure()
odometry = {}
for e, colour in [(0.001, BLUE), (0.0025, NAVY), (0.005, RED)]:
    heading = e * s / b
    lateral = np.concatenate([[0], np.cumsum(np.sin(heading[:-1]) * ds)])
    approx = e * s**2 / (2 * b)
    odometry[f"{e*100:.2f}%"] = {
        "lateral_at_5m_m": round(float(np.interp(5, s, lateral)), 4),
        "lateral_at_10m_m": round(float(np.interp(10, s, lateral)), 4),
        "lateral_at_20m_m": round(float(np.interp(20, s, lateral)), 4),
        "heading_at_10m_deg": round(math.degrees(e * 10 / b), 3),
        "small_angle_at_10m_m": round(float(e * 100 / (2 * b)), 4),
    }
    ax.plot(s, lateral, color=colour, linewidth=2.6, label=f"{e*100:.2f}% wheel diameter mismatch")
ax.set_xlabel("Distance driven in a commanded straight line (m)")
ax.set_ylabel("Sideways position error (m)")
ax.set_title("Error from a constant wheel mismatch grows with distance squared")
ax.annotate("0.10% mismatch: 0.17 m off after 10 m", xy=(10, odometry["0.10%"]["lateral_at_10m_m"]),
            xytext=(1.2, 1.6), color=NAVY, arrowprops={"arrowstyle": "->", "color": NAVY})
ax.text(0.99, 0.02, "Model: wheelbase 0.30 m, flat floor, no slip, no correction", transform=ax.transAxes,
        ha="right", va="bottom", color=INK, fontsize=11)
ax.set_xlim(0, 20)
ax.set_ylim(0, None)
ax.legend(frameon=False, loc="upper left")
save(fig, "20261030-Odometry-Drift-Rev00")
results["odometry"] = {"wheelbase_m": b, "cases": odometry}

# 2. Integrator windup: PI speed loop with a saturated drive.
# Plant tau*dy/dt = -y + u, output and command normalised to maximum speed; |u| <= 1.
tau, kp, ki, dt, t_end, r = 0.5, 2.0, 4.0, 0.001, 6.0, 0.9
t = np.arange(0, t_end, dt)


def simulate(mode):
    y, integ, ys, us = 0.0, 0.0, [], []
    for _ in t:
        err = r - y
        u_raw = kp * err + ki * integ
        u = min(1.0, max(-1.0, u_raw))
        if mode == "none":
            integ += err * dt
        elif mode == "clamp":
            if u == u_raw or (u_raw > 1 and err < 0) or (u_raw < -1 and err > 0):
                integ += err * dt
        elif mode == "back":
            tt = 0.25  # tracking time constant, s
            integ += (err + (u - u_raw) / (ki * tt)) * dt
        y += dt * (-y + u) / tau
        ys.append(y)
        us.append(u)
    ys = np.array(ys)
    settle = next((t[i] for i in range(len(t)) if np.all(np.abs(ys[i:] - r) <= 0.02 * r)), None)
    return ys, {"peak": round(float(ys.max()), 4), "overshoot_pct": round(float((ys.max() - r) / r * 100), 2),
                "settling_2pct_s": None if settle is None else round(float(settle), 3)}


fig, ax = figure()
windup = {}
for mode, label, colour in [("none", "No anti-windup", RED), ("clamp", "Conditional integration", NAVY),
                            ("back", "Back-calculation, Tt = 0.25 s", BLUE)]:
    ys, stats = simulate(mode)
    windup[mode] = stats
    ax.plot(t, ys, color=colour, linewidth=2.6, label=f"{label}: peak {stats['peak']:.3f}")
ax.axhline(r, color=INK, linestyle="--", linewidth=1.2)
ax.axhline(1.0, color=AMBER, linewidth=3)
ax.text(5.95, 1.005, "Drive limit (100%)", ha="right", va="bottom", color=NAVY, fontsize=11)
ax.text(5.95, r - 0.01, "Setpoint 90%", ha="right", va="top", color=INK, fontsize=11)
ax.set_xlabel("Time (s)")
ax.set_ylabel("Speed (fraction of maximum)")
ax.set_title("Same PI gains, same saturated drive, different integrator handling")
ax.set_xlim(0, 6)
ax.set_ylim(0, 1.25)
ax.legend(frameon=False, loc="lower right")
save(fig, "20261030-PID-Windup-Rev00")
results["windup"] = {"tau_s": tau, "kp": kp, "ki_per_s": ki, "setpoint": r, "dt_s": dt, "cases": windup}

# 3. Motor sizing for a ball-screw axis with a trapezoidal move.
m, pitch, eta, mu, g = 20.0, 0.010, 0.90, 0.05, 9.81
d_screw, l_screw, rho = 0.016, 0.50, 7850.0
j_screw = math.pi * rho * l_screw * d_screw**4 / 32
j_load = m * (pitch / (2 * math.pi)) ** 2
j_motor = 0.26e-4  # assumed candidate rotor inertia, kg m^2 (0.26 kg cm^2)
stroke, ta, tc, td, dwell = 0.20, 0.15, 0.30, 0.15, 0.40
v_max = stroke / (ta + tc)  # trapezoid: area = v_max * (ta/2 + tc + td/2)
n_max = v_max / pitch * 60
alpha = (v_max / pitch * 2 * math.pi) / ta
t_fric = mu * m * g * pitch / (2 * math.pi * eta)
j_total = j_load / eta + j_screw + j_motor
t_acc = j_total * alpha + t_fric
t_run = t_fric
t_dec = -j_total * alpha + t_fric
cycle = ta + tc + td + dwell
t_rms = math.sqrt((t_acc**2 * ta + t_run**2 * tc + t_dec**2 * td) / cycle)
ratio = (j_load / eta + j_screw) / j_motor
results["motor"] = {
    "inputs": {"mass_kg": m, "pitch_m": pitch, "efficiency": eta, "friction_coefficient": mu,
               "screw_diameter_m": d_screw, "screw_length_m": l_screw, "assumed_rotor_inertia_kgm2": j_motor,
               "stroke_m": stroke, "accel_s": ta, "constant_s": tc, "decel_s": td, "dwell_s": dwell},
    "v_max_m_s": round(v_max, 4), "speed_rpm": round(n_max, 1), "alpha_rad_s2": round(alpha, 1),
    "j_screw_kgm2": j_screw, "j_load_reflected_kgm2": j_load, "inertia_ratio": round(ratio, 2),
    "torque_friction_Nm": round(t_fric, 4), "torque_accel_Nm": round(t_acc, 4),
    "torque_decel_Nm": round(t_dec, 4), "torque_rms_Nm": round(t_rms, 4),
    "check_distance_m": round(v_max * (ta / 2 + tc + td / 2), 4),
}
tt = np.linspace(0, cycle, 2000)
torque = np.where(tt < ta, t_acc, np.where(tt < ta + tc, t_run, np.where(tt < ta + tc + td, t_dec, 0.0)))
fig, ax = figure()
ax.step(tt, torque, where="post", color=NAVY, linewidth=2.6, label="Required motor torque")
ax.axhline(t_rms, color=AMBER, linewidth=3, label=f"RMS over the cycle: {t_rms:.3f} N m")
ax.axhline(0, color=INK, linewidth=0.8)
ax.text(ta / 2, t_acc + 0.02, f"Accelerate\n{t_acc:.3f} N m", ha="center", va="bottom", color=NAVY)
ax.text(ta + tc / 2, t_run + 0.05, f"Constant {n_max:.0f} rpm\n{t_run:.3f} N m", ha="center", va="bottom", color=NAVY)
ax.text(ta + tc + td / 2, t_dec - 0.02, f"Decelerate\n{t_dec:.3f} N m", ha="center", va="top", color=NAVY)
ax.text(ta + tc + td + dwell / 2, 0.05, "Dwell", ha="center", va="bottom", color=INK)
ax.set_xlabel("Time in one 1.0 s cycle (s)")
ax.set_ylabel("Torque at the motor shaft (N m)")
ax.set_title("A 200 mm ball-screw move: peak, running and RMS torque")
ax.set_ylim(t_dec - 0.25, t_acc + 0.3)
ax.legend(frameon=False, loc="upper right")
save(fig, "20261030-Motor-Sizing-Rev00")

# 4. Retrieval pipeline: where a grounded answer can fail.
fig, ax = plt.subplots(figsize=(12, 7.2), facecolor=BG)
ax.set_facecolor(BG)
ax.set_xlim(0, 12)
ax.set_ylim(0, 7.2)
ax.axis("off")
ax.text(0.4, 6.7, "Four places a document-grounded answer can fail", color=NAVY, fontsize=19, fontweight="bold")
stages = [("1  Index", "Is the right passage\nin the index at all?", "Missing, split badly\nor out of date"),
          ("2  Retrieve", "Is it in the top k\nfor this question?", "Ranked below the\ncut-off"),
          ("3  Read", "Did the model use\nthe passage it got?", "Ignored, or outvoted\nby a wrong passage"),
          ("4  Answer", "Is every claim backed\nby a cited passage?", "Unsupported detail\nadded to the answer")]
for i, (name, question, failure) in enumerate(stages):
    x = 0.4 + i * 2.95
    ax.add_patch(FancyBboxPatch((x, 3.5), 2.55, 2.5, boxstyle="square,pad=0", facecolor="white", edgecolor=NAVY, linewidth=1.6))
    ax.add_patch(FancyBboxPatch((x, 5.35), 2.55, 0.65, boxstyle="square,pad=0", facecolor=AMBER, edgecolor=NAVY, linewidth=1.6))
    ax.text(x + 0.15, 5.67, name, color=NAVY, fontsize=15, fontweight="bold", va="center")
    ax.text(x + 0.15, 4.45, question, color=NAVY, fontsize=13, va="center")
    ax.add_patch(FancyBboxPatch((x, 1.6), 2.55, 1.4, boxstyle="square,pad=0", facecolor="#f6e3dd", edgecolor=RED, linewidth=1.2))
    ax.text(x + 0.15, 2.3, failure, color="#7a2a17", fontsize=12.5, va="center")
    if i < 3:
        ax.annotate("", xy=(x + 2.92, 4.75), xytext=(x + 2.58, 4.75), arrowprops={"arrowstyle": "-|>", "color": NAVY, "lw": 1.8})
ax.text(0.4, 0.75, "Test each stage on its own. A wrong final answer does not tell you which stage failed.",
        color=INK, fontsize=13.5)
save(fig, "20261030-Retrieval-Failures-Rev00")

# 5. NASA error cost escalation, total cost breakdown method (Table 8, Stecklein et al. 2004).
phases = ["Requirements", "Design", "Build", "Test", "Operations"]
low = [1, 3, 13, 61, 157]
high = [1, 4, 16, 78, 186]
fig, ax = figure()
ax.grid(axis="x", visible=False)
x = np.arange(len(phases))
ax.bar(x, high, color=AMBER, edgecolor=NAVY, linewidth=1.4, width=0.6, label="Upper value")
ax.bar(x, low, color=NAVY, width=0.6, label="Lower value")
for i in range(len(phases)):
    text = "1x" if low[i] == high[i] else f"{low[i]}x - {high[i]}x"
    ax.text(x[i], high[i] * 1.15, text, ha="center", va="bottom", color=NAVY, fontweight="bold")
ax.set_yscale("log")
ax.set_ylim(0.8, 400)
ax.set_xticks(x, phases)
ax.set_ylabel("Relative cost to fix a requirements error (log scale)")
ax.set_xlabel("Phase in which the error is found")
ax.set_title("The same mistake costs more the later it is found")
ax.text(0.99, 0.02, "Data: NASA JSC, Stecklein et al. (2004), Table 8, total cost breakdown method",
        transform=ax.transAxes, ha="right", va="bottom", color=INK, fontsize=11)
ax.legend(frameon=False, loc="upper left")
save(fig, "20261030-Slow-Down-Cost-Rev00")
results["nasa_table8"] = dict(zip(phases, [[lo, hi] for lo, hi in zip(low, high)]))

(OUT / "20261030-Article-Figures-Rev00.json").write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
print(json.dumps(results, indent=2))
