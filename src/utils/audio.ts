export function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playBeep = (time: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      osc.start(time);
      osc.stop(time + 0.3);
    };
    playBeep(ctx.currentTime, 800);
    playBeep(ctx.currentTime + 0.35, 800);
    playBeep(ctx.currentTime + 0.7, 1000);
  } catch (e) {
    console.warn('Audio not available');
  }
}
