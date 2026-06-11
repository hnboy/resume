const aiService = require('../services/aiService')
const resumeService = require('../services/resumeService')

exports.generateResume = async (req, res) => {
  try {
    const { basicInfo, education, experience, skills, projects, targetJob } = req.body
    const result = await aiService.generateResume(
      basicInfo || {},
      education || [],
      experience || [],
      skills || [],
      projects || [],
      targetJob || ''
    )
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.optimizeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body
    
    let resume
    if (resumeId) {
      resume = await resumeService.getResumeById(resumeId)
      if (!resume) {
        return res.status(404).json({ success: false, message: '简历不存在' })
      }
    } else {
      resume = req.body.resume || {}
    }
    
    const result = await aiService.optimizeResume(resume, jobDescription)
    res.json({ success: true, data: { optimization: result } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.analyzeJob = async (req, res) => {
  try {
    const { jobDescription } = req.body
    const result = await aiService.analyzeJobDescription(jobDescription)
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.generateSummary = async (req, res) => {
  try {
    const { text } = req.body
    const result = await aiService.generateSummary(text)
    res.json({ success: true, data: { summary: result } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.generateBulletPoints = async (req, res) => {
  try {
    const { experience } = req.body
    const result = await aiService.generateBulletPoints(experience)
    res.json({ success: true, data: { bulletPoints: result } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}