// Le son du début de série : un bol chantant, puis une nappe chaude et 4 notes qui montent lentement (Fmaj9 → Cadd9).
// Calme, pour se poser et se concentrer. Calculé ici, écrit en WAV : node son-debut.js sortie.wav
const fs = require('fs');
const SR = 44100, DUR = 11, N = SR * DUR, TAU = Math.PI * 2;
const L = new Float32Array(N), R = new Float32Array(N);
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const add = (t0, dur, pan, fn) => {
  const i0 = Math.round(t0 * SR), gl = Math.cos(pan * Math.PI / 2), gr = Math.sin(pan * Math.PI / 2);
  for (let j = 0; j < dur * SR && i0 + j < N; j++) { const v = fn(j / SR); L[i0 + j] += gl * v; R[i0 + j] += gr * v; }
};
// bol chantant : partiels inharmoniques, attaque douce, longue queue, léger battement
const bowl = (t0, m, vel) => {
  const f = hz(m), P = [[1, 1, 7], [2.71, .45, 4.5], [5.12, .2, 2.6], [8.3, .07, 1.4]];
  add(t0, 9, .5, t => Math.min(1, t / .01) * vel * P.reduce((s, [r, a, d]) => s + a * Math.exp(-t / d) * Math.sin(TAU * f * r * t) * (1 + .25 * Math.sin(TAU * 1.3 * t)), 0));
};
// nappe : deux sinus un peu désaccordés, montée et descente lentes
const pad = (t0, dur, m, vel, pan) => {
  const f = hz(m);
  add(t0, dur, pan, t => vel * Math.min(1, t / 2) * Math.min(1, (dur - t) / 2.5) * (Math.sin(TAU * f * .997 * t) + Math.sin(TAU * f * 1.003 * t) + .25 * Math.sin(TAU * 2 * f * t)));
};
// note douce (type piano feutré)
const soft = (t0, m, vel, pan) => {
  const f = hz(m);
  add(t0, 4, pan, t => vel * Math.min(1, t / .02) * Math.exp(-t / 1.3) * (Math.sin(TAU * f * t) + .3 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / .4)));
};

bowl(0, 69, .32);                                   // la : le bol qui ouvre
[[53, 57, 60, 64, 67]].forEach(ch => ch.forEach((m, i) => pad(.6, 5.4, m, .035, .2 + i * .15)));   // Fmaj9
[[48, 55, 62, 64, 67]].forEach(ch => ch.forEach((m, i) => pad(5.2, 5.8, m, .035, .2 + i * .15)));  // Cadd9
[[1.6, 72], [2.6, 76], [3.6, 79], [4.8, 84]].forEach(([t, m], i) => soft(t, m, .12, .35 + i * .1)); // do mi sol do, qui montent
bowl(5.2, 76, .14);                                 // un second bol, plus léger, sur le changement d'accord

// petit écho, puis normalisation et fondu final
for (const B of [L, R]) for (let i = Math.round(.33 * SR); i < N; i++) B[i] += .28 * B[i - Math.round(.33 * SR)];
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = .8 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, (N - i) / (1.5 * SR));
  buf.writeInt16LE(Math.round(32767 * Math.max(-1, Math.min(1, L[i] * g * fade))), 44 + i * 4);
  buf.writeInt16LE(Math.round(32767 * Math.max(-1, Math.min(1, R[i] * g * fade))), 46 + i * 4);
}
fs.writeFileSync(process.argv[2] || 'debut.wav', buf);
