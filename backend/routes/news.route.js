const {getTopHeadlines,getEverything,getSources,getCategories,getCountries,getLanguages} = require('../controllers/news.controller.js'); 

const express = require('express');
const router = express.Router();

// Top Headlines route
router.get('/top-headlines', getTopHeadlines);
// Everything route
router.get('/everything', getEverything);
// Sources route
router.get('/sources', getSources);
// Get available countries
router.get('/countries', getCountries);
// Get available languages
router.get('/languages', getLanguages);
// Get available categories
router.get('/categories', getCategories);

module.exports = router;