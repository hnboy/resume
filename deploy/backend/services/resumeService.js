const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const config = require('../config')

const storageDir = path.join(__dirname, '..', config.STORAGE_DIR)

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true })
}

const resumesFilePath = path.join(storageDir, 'resumes.json')

const initResumesFile = () => {
  if (!fs.existsSync(resumesFilePath)) {
    fs.writeFileSync(resumesFilePath, JSON.stringify([]))
  }
}

initResumesFile()

const readResumes = () => {
  const data = fs.readFileSync(resumesFilePath, 'utf-8')
  return JSON.parse(data)
}

const writeResumes = (resumes) => {
  fs.writeFileSync(resumesFilePath, JSON.stringify(resumes, null, 2))
}

exports.getAllResumes = async () => {
  return readResumes()
}

exports.getResumeById = async (id) => {
  const resumes = readResumes()
  return resumes.find(r => r.id === id)
}

exports.createResume = async (data) => {
  const resumes = readResumes()
  const newResume = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data
  }
  resumes.push(newResume)
  writeResumes(resumes)
  return newResume
}

exports.updateResume = async (id, data) => {
  const resumes = readResumes()
  const index = resumes.findIndex(r => r.id === id)
  if (index === -1) return null
  
  resumes[index] = {
    ...resumes[index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  writeResumes(resumes)
  return resumes[index]
}

exports.deleteResume = async (id) => {
  const resumes = readResumes()
  const filtered = resumes.filter(r => r.id !== id)
  if (filtered.length === resumes.length) return false
  writeResumes(filtered)
  return true
}

exports.generateTargetedResume = async (id, jobDescription) => {
  const resume = await this.getResumeById(id)
  if (!resume) throw new Error('简历不存在')
  
  const keywords = extractKeywords(jobDescription)
  const targetedResume = optimizeResumeForJob(resume, keywords)
  
  return targetedResume
}

const extractKeywords = (jobDescription) => {
  const techKeywords = [
    'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C++', 'React', 
    'Vue', 'Angular', 'Node.js', 'Spring', 'Django', 'MySQL', 'PostgreSQL',
    'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Git', 'Linux'
  ]
  
  const softSkills = [
    '团队协作', '沟通能力', '项目管理', '问题解决', '学习能力', '创新思维'
  ]
  
  const foundKeywords = []
  
  techKeywords.forEach(keyword => {
    if (jobDescription.toLowerCase().includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword)
    }
  })
  
  softSkills.forEach(skill => {
    if (jobDescription.includes(skill)) {
      foundKeywords.push(skill)
    }
  })
  
  return foundKeywords
}

const optimizeResumeForJob = (resume, keywords) => {
  const optimized = { ...resume }
  
  if (optimized.experience) {
    optimized.experience = optimized.experience.map(exp => {
      let score = 0
      keywords.forEach(keyword => {
        const expText = JSON.stringify(exp).toLowerCase()
        if (expText.includes(keyword.toLowerCase())) {
          score += 1
        }
      })
      return { ...exp, relevanceScore: score }
    }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
  }
  
  if (optimized.skills) {
    optimized.skills = optimized.skills.map(skill => {
      const matched = keywords.some(k => 
        skill.name.toLowerCase().includes(k.toLowerCase()) || 
        k.toLowerCase().includes(skill.name.toLowerCase())
      )
      return { ...skill, highlighted: matched }
    }).sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0))
  }
  
  optimized.keywords = keywords
  optimized.optimizedAt = new Date().toISOString()
  
  return optimized
}