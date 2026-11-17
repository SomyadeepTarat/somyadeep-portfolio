export function playSound(kind: "open" | "close" | "notification") {
  if (document.documentElement.dataset.sound !== "on") return;
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator(),
      gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value =
      kind === "open" ? 520 : kind === "close" ? 390 : 660;
    gain.gain.setValueAtTime(0.025, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.13);
    oscillator.onended = () => {
      audio.close();
    };
  } catch {}
}
