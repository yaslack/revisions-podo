// Le son du début de série : doux, sans attaque — une nappe chaude qui monte lentement et un piano feutré,
// grave et lent (Fmaj7 → Cmaj7 → Am7 → Fmaj7), filtré pour rester rond. node son-debut.js sortie.wav
const fs = require('fs');
const SR = 44100, DUR = 11, N = SR * DUR, TAU = Math.PI * 2;
const L = new Float32Array(N), R = new Float32Array(N);
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const add = (t0, dur, pan, fn) => {
  const i0 = Math.round(t0 * SR), gl = Math.cos(pan * Math.PI / 2), gr = Math.sin(pan * Math.PI / 2);
  for (let j = 0; j < dur * SR && i0 + j < N; j++) { const v = fn(j / SR); L[i0 + j] += gl * v; R[i0 + j] += gr * v; }
};
// nappe : sinus un peu désaccordés, montée et descente très lentes
const pad = (t0, dur, m, vel, pan) => {
  const f = hz(m);
  add(t0, dur, pan, t => vel * Math.min(1, t / 2.5) * Math.min(1, (dur - t) / 2.5) * (Math.sin(TAU * f * .998 * t) + Math.sin(TAU * f * 1.002 * t)));
};
// piano feutré : attaque arrondie, presque pas d'harmoniques
const soft = (t0, m, vel, pan) => {
  const f = hz(m);
  add(t0, 5, pan, t => vel * Math.min(1, t / .06) * Math.exp(-t / 1.8) * (Math.sin(TAU * f * t) + .15 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / .6)));
};

const CH = [[41, 53, 57, 60, 64], [36, 52, 55, 59, 64], [45, 52, 55, 60, 64], [41, 53, 57, 60, 65]];   // Fmaj7 Cmaj7 Am7 Fmaj7
CH.forEach((ch, k) => ch.forEach((m, i) => pad(k * 2.6, 5.4, m, i ? .03 : .045, .25 + i * .12)));
[[.8, 64], [2.0, 67], [3.4, 69], [4.8, 67], [6.0, 64], [7.6, 65], [8.6, 64]].forEach(([t, m], i) => soft(t, m, .1, .4 + (i % 3) * .1));

// filtre passe-bas doux (tout reste rond)
for (const B of [L, R]) { let y = 0; for (let i = 0; i < N; i++) { y += (B[i] - y) * .12; B[i] = y; } }
// petit écho, puis normalisation et fondu final
for (const B of [L, R]) for (let i = Math.round(.33 * SR); i < N; i++) B[i] += .28 * B[i - Math.round(.33 * SR)];
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = .55 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, i / (.8 * SR), (N - i) / (2.5 * SR));
  buf.writeInt16LE(Math.round(32767 * Math.max(-1, Math.min(1, L[i] * g * fade))), 44 + i * 4);
  buf.writeInt16LE(Math.round(32767 * Math.max(-1, Math.min(1, R[i] * g * fade))), 46 + i * 4);
}
fs.writeFileSync(process.argv[2] || 'debut.wav', buf);
