// field validation
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (email.match(regEx));
};

const isEmpty = (string) => {
  return (string.trim() === '' );
};

// data is equivalent to req.body, so has those properties
exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
      errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
      errors.email = 'Address must be valid';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Must be the same as password';
  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};

exports.validateLoginData = (data) => {

  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};

// check if fields are empty and if not, populate userDetails
exports.reduceUserDetails = (data) => {
  let userDetails = {};
  let website = data.website.trim();

  if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if(!isEmpty(website)) {
    if(website.startsWith('http')) {
      userDetails.website = website;
    } else userDetails.website = `http://${website}`;
  }
  if(!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

