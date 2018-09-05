export const getDateDiffInMinutes = (dt1, dt2) => {
  const diff = (dt2 - dt1) / 1000;
  return diff / 60;
};
