export type AnimationType = 'quiet' | 'normal' | 'loud'

export function getSoundConfig(bpm: number): AnimationType[] {
  if (bpm >= 130) return ['loud', 'loud', 'normal', 'loud', 'loud']
  if (bpm >= 125) return ['normal', 'loud', 'normal', 'loud', 'normal']
  return ['quiet', 'normal', 'quiet', 'loud', 'quiet']
}

export const barDelays = [0, 0.2, 0.4, 0.6, 0.8]