// helpers.js
const handlebars = require('handlebars');

handlebars.registerHelper('format_date', (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-US', options);
});

handlebars.registerHelper('format_time', (date) => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Date(date).toLocaleTimeString('en-US', options);
});

module.exports = handlebars;
