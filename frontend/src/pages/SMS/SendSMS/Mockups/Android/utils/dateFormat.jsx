export const dateFormatwithoutTime = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

export const timeFormat = (time) => {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(time);
};
