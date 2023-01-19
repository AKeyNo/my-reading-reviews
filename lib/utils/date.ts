export const stringToMonthDayYear = (time: string) => {
  const date = new Date(time);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};
