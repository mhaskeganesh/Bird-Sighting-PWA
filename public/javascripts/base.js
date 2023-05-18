const getFormattedDate = (date) => {
  const formattedDate = new Date(date);
  return `${formattedDate.getDate()} ${formattedDate.toLocaleString('default', { month: 'long' })}  ${formattedDate.getFullYear()}`;
};

const getURLSearchParms = () => Object.fromEntries(new URLSearchParams(window.location.search));
