module.exports = {
  originCityCode: {
    isLength: {
      options: { min: 3, max: 3 },
    },
    trim: true,
  },
  destinationCityCode: {
    isLength: {
      options: { min: 3, max: 3 },
    },
    trim: true,
  },
  fromDate: {
    isLength: {
      options: { min: 8, max: 8 },
    },
    trim: true,
  },
  toDate: {
    isLength: {
      options: { min: 8, max: 8 },
    },
    trim: true,
  },
};
