const express = require('express')
const router = express.Router()
const jobController = require('../controllers/job')

router.post('/match', jobController.matchJob)
router.post('/analyze', jobController.analyzeJob)
router.get('/suggestions', jobController.getSuggestions)

module.exports = router