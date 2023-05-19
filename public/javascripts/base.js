/**
 * This method is used to return a human readable date from a timestamp.
 *
 * @param date
 * @returns {`${number} ${string}  ${number}`}
 */
const getFormattedDate = (date) => {
  const formattedDate = new Date(date);
  return `${formattedDate.getDate()} ${formattedDate.toLocaleString('default', { month: 'long' })}  ${formattedDate.getFullYear()}`;
};

/**
 * This method is used to return urlSearchParams from the url as an object.
 *
 * @returns {{[p: string]: any}}
 */
const getURLSearchParms = () => Object.fromEntries(new URLSearchParams(window.location.search));
