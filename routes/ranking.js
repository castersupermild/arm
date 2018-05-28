const express = require('express');
const userModule = require('../models/user');

const router = express.Router();

router.get('/', async (req, res /* , next */) => {
  let index = 0;
  let showIndex = 0;
  let prevRating = 999999;
  const sortedUsers = await userModule.getUsersSortByRating(100);
  const users = sortedUsers.map(user => {
    index += 1;
    if (prevRating > user.rating) {
      prevRating = user.rating;
      showIndex = index;
    }
    // eslint-disable-next-line no-param-reassign
    user.ranking = showIndex;
    return user;
  });

  res.render('ranking', {
    title: 'Ranking',
    users,
  });
});

module.exports = router;
