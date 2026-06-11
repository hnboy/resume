const resumeService = require('../services/resumeService')

exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await resumeService.getAllResumes()
    res.json({ success: true, data: resumes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.getResumeById = async (req, res) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id)
    if (!resume) {
      return res.status(404).json({ success: false, message: '简历不存在' })
    }
    res.json({ success: true, data: resume })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.createResume = async (req, res) => {
  try {
    const resume = await resumeService.createResume(req.body)
    res.status(201).json({ success: true, data: resume })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.updateResume = async (req, res) => {
  try {
    const resume = await resumeService.updateResume(req.params.id, req.body)
    if (!resume) {
      return res.status(404).json({ success: false, message: '简历不存在' })
    }
    res.json({ success: true, data: resume })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.deleteResume = async (req, res) => {
  try {
    const result = await resumeService.deleteResume(req.params.id)
    if (!result) {
      return res.status(404).json({ success: false, message: '简历不存在' })
    }
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.generateResume = async (req, res) => {
  try {
    const { jobDescription } = req.body
    const resume = await resumeService.generateTargetedResume(req.params.id, jobDescription)
    res.json({ success: true, data: resume })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}