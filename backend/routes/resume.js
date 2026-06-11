const express = require('express')
const router = express.Router()
const resumeController = require('../controllers/resume')

router.get('/', resumeController.getAllResumes)
router.get('/:id', resumeController.getResumeById)
router.post('/', resumeController.createResume)
router.put('/:id', resumeController.updateResume)
router.delete('/:id', resumeController.deleteResume)
router.post('/:id/generate', resumeController.generateResume)

module.exports = router