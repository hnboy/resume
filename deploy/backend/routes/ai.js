const express = require('express')
const router = express.Router()
const aiController = require('../controllers/ai')

router.post('/generate', aiController.generateResume)
router.post('/optimize', aiController.optimizeResume)
router.post('/analyze-job', aiController.analyzeJob)
router.post('/summary', aiController.generateSummary)
router.post('/bullet-points', aiController.generateBulletPoints)

module.exports = router