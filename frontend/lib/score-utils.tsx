// Convert letter grade to numeric score with randomized range
export const gradeToScore = (grade: string): number => {
  const gradeRanges: Record<string, [number, number]> = {
    "A+": [96, 100],
    A: [91, 95],
    "A-": [88, 90],
    "B+": [85, 87],
    B: [81, 84],
    "B-": [78, 80],
    "C+": [75, 77],
    C: [71, 74],
    "C-": [68, 70],
    D: [60, 67],
    F: [40, 59],
  };

  const range = gradeRanges[grade];
  if (!range) return 75; // Default to 75 if grade not recognized

  // Generate random number within the range
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
