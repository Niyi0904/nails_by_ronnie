// utils/getRecommendation.ts
export function getNailRecommendation(weatherCondition: string) {
    const condition = weatherCondition.toLowerCase();
  
    if (condition.includes("rain")) {
      return "Glossy, water-resistant gel nails to keep the shine!";
    } else if (condition.includes("sunny")) {
      return "Bright neon or pastel nails to match the sun!";
    } else if (condition.includes("cloudy")) {
      return "Muted matte colors like gray, lilac, or dusty rose.";
    } else if (condition.includes("snow")) {
      return "Sparkly winter tones like silver, white, or icy blue.";
    } else {
      return "A classic French tip works great anytime!";
    }
  }
  