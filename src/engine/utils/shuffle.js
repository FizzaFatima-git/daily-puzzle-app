export function deterministicShuffle(array, seed = 1) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(((seed * (i + 1)) % 1) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  