export const validatePercentages = (participants) => {
    const total = participants.reduce((sum, p) => sum + p.percentage, 0);
    return total === 100;
  };
  