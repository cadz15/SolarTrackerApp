export default (voltage: number) => {
  // Define the reference voltage for 100% battery
  const fullChargeVoltage = 3.7;

  // Calculate the battery percentage
  // Assuming the battery is between 0V and 3.7V, adjust if necessary
  let percentage = (voltage / fullChargeVoltage) * 100;

  // Ensure the percentage is between 0 and 100
  percentage = Math.max(0, Math.min(100, percentage));

  return percentage.toFixed(2);
};
