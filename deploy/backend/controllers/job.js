const jobService = require('../services/jobService')

exports.matchJob = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body
    const result = await jobService.matchJob(resumeId, jobDescription)
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.analyzeJob = async (req, res) => {
  try {
    const { jobDescription } = req.body
    const analysis = await jobService.analyzeJob(jobDescription)
    res.json({ success: true, data: analysis })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await jobService.getSuggestions()
    res.json({ success: true, data: suggestions })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}