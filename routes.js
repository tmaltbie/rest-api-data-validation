'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

// This array is used to keep track of user records
// as they are created.
const users = [];

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', (req, res) => {
  res.json(users);
});

// The check() method returns a "validation chain"
// const nameValidationChain = check('name')
//   .exists({ checkNull: true, checkFalsy: true })
//   .withMessage('Please provide a value for me');

// Route that creates a new user.
router.post('/users', [
  check('name')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "nane"'),
  check('email')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .trim()
    .withMessage('Please provide a valid email address for "email"'),
  check('birthday')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "birthday"')
    .isISO8601()
    .withMessage('Please provide a valid birthday for "birthday", example: 2020-10-03'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please provide a password that is between 8 and 20 characters'),
  check('passwordConfirmaiton')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Please provide values for "password" and confirmedPassword" that match');
      }
      return true;
    }),
], (req, res) => {
  // Attempt to get the validation results from the Request object
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    res.status(400).json({ errors: errorMessages });

    // else clause: this will only execute if there ARE NOT any validation erros
  } else {
    // Get the user from the request body.
    const user = req.body;

    // Add the user to the `users` array.
    users.push(user);

    // Set the status to 201 Created and end the reponse
    res.status(201).end();
  }

  // validation
//   const errors = [];
//   // Validate that there is a 'name' value.
//   if (!user.name) {
//     errors.push('Please provide a value for "name"');
//   }
//   // Validate that there is an 'email' value.
//   if (!user.email) {
//     errors.push('Please provie a value for "email."');
//   }
//   // Validate for password.
//   let { password } = user;

//   if (!password) {
//     errors.push('Please enter a password!');
//   } else if (password.length < 8 || password.length > 20) {
//     errors.push('Your password needs to be between 8 and 20 characters');
//   } else {
//     password = bcrypt.hashSync(user.password, 10);
//   }

//   // If there are any errors...
//   if (errors.length > 0) {
//     // Return validation errors to the client.
//     res.status(400).json({ errors });
//   } else {
//     // Add the user to the `users` array.
//     users.push(user);

//     // Set the status to 201 Created and end the response.
//     res.status(201).end();
//   }
});

module.exports = router;
