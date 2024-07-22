export const getColorFromValue = (value) => {
    const colorMap = {
      notStarted: { bgColor: '#0000001A', textColor: '#1C1F4C99' }, // Example: Light background, dark text
      inProgress: { bgColor: '#E5F2FF', textColor: '#7FBCFE' }, // Example: Dark background, light text
      completed: { bgColor: '#f8dbdd', textColor: '#da4c57' }, // Example: Light background, dark text
      // Add more mappings as needed
    };
    // Default colors if value not found
    const defaultColors = { bgColor: '#f8dbdd', textColor: '#000000' };
    return colorMap[value] || defaultColors;
};