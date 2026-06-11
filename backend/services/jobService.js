const resumeService = require('./resumeService')

exports.matchJob = async (resumeId, jobDescription) => {
  const resume = await resumeService.getResumeById(resumeId)
  if (!resume) throw new Error('简历不存在')
  
  const resumeText = JSON.stringify(resume)
  const keywords = extractKeywords(jobDescription)
  
  let matchScore = 0
  const matchedKeywords = []
  
  keywords.forEach(keyword => {
    if (resumeText.toLowerCase().includes(keyword.toLowerCase())) {
      matchScore += 1
      matchedKeywords.push(keyword)
    }
  })
  
  const maxScore = Math.min(keywords.length, 20)
  const percentage = Math.round((matchScore / maxScore) * 100)
  
  const suggestions = generateSuggestions(resume, keywords, matchedKeywords)
  
  return {
    matchScore,
    percentage,
    matchedKeywords,
    missingKeywords: keywords.filter(k => !matchedKeywords.includes(k)),
    suggestions
  }
}

exports.analyzeJob = async (jobDescription) => {
  const keywords = extractKeywords(jobDescription)
  
  const categoryStats = {
    technical: keywords.filter(k => isTechnical(k)),
    softSkills: keywords.filter(k => isSoftSkill(k)),
    tools: keywords.filter(k => isTool(k))
  }
  
  return {
    keywords,
    categoryStats,
    keywordCount: keywords.length,
    summary: generateAnalysisSummary(categoryStats)
  }
}

exports.getSuggestions = async () => {
  return [
    { id: 1, title: 'Java开发工程师', keywords: ['Java', 'Spring', 'MySQL', 'Git'] },
    { id: 2, title: '前端开发工程师', keywords: ['JavaScript', 'React', 'Vue', 'Node.js'] },
    { id: 3, title: '全栈开发工程师', keywords: ['JavaScript', 'Python', 'React', 'Django', 'MySQL'] },
    { id: 4, title: '数据分析师', keywords: ['Python', 'SQL', '数据分析', 'Excel'] },
    { id: 5, title: '产品经理', keywords: ['需求分析', '项目管理', '沟通能力', '用户体验'] }
  ]
}

const extractKeywords = (jobDescription) => {
  const allKeywords = [
    'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C++', 'C#', 'PHP',
    'React', 'Vue', 'Angular', 'Node.js', 'Spring', 'Spring Boot', 'Django', 'Flask',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server',
    'Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux', 'AWS', 'Azure', 'Docker',
    'HTML', 'CSS', 'Sass', 'Webpack', 'Vite', 'webpack', 'npm', 'yarn',
    '团队协作', '沟通能力', '项目管理', '问题解决', '学习能力', '创新思维',
    '需求分析', '用户体验', '敏捷开发', '测试驱动', '代码审查',
    '数据分析', '数据挖掘', '机器学习', '深度学习', '算法', '数据结构'
  ]
  
  const foundKeywords = []
  
  allKeywords.forEach(keyword => {
    if (jobDescription.toLowerCase().includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword)
    }
  })
  
  return [...new Set(foundKeywords)]
}

const isTechnical = (keyword) => {
  const techList = ['Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C++', 'C#', 'PHP',
    'React', 'Vue', 'Angular', 'Node.js', 'Spring', 'Django', 'Flask', 'MySQL', 'PostgreSQL', 
    'MongoDB', 'Redis', 'Oracle', 'SQL Server']
  return techList.includes(keyword)
}

const isSoftSkill = (keyword) => {
  const softList = ['团队协作', '沟通能力', '项目管理', '问题解决', '学习能力', '创新思维',
    '需求分析', '用户体验', '敏捷开发', '测试驱动', '代码审查']
  return softList.includes(keyword)
}

const isTool = (keyword) => {
  const toolList = ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux', 'AWS', 'Azure',
    'HTML', 'CSS', 'Sass', 'Webpack', 'Vite']
  return toolList.includes(keyword)
}

const generateSuggestions = (resume, allKeywords, matchedKeywords) => {
  const suggestions = []
  const missingKeywords = allKeywords.filter(k => !matchedKeywords.includes(k))
  
  if (missingKeywords.length > 0) {
    suggestions.push({
      type: 'add_skills',
      message: `建议在简历中添加以下关键词相关内容: ${missingKeywords.join('、')}`,
      keywords: missingKeywords
    })
  }
  
  const experience = resume.experience || []
  if (experience.length === 0) {
    suggestions.push({
      type: 'add_experience',
      message: '建议添加项目经验或实习经历，这对招聘方非常重要'
    })
  }
  
  const education = resume.education || []
  if (education.length === 0) {
    suggestions.push({
      type: 'add_education',
      message: '建议添加教育背景信息'
    })
  }
  
  return suggestions
}

const generateAnalysisSummary = (categoryStats) => {
  const parts = []
  
  if (categoryStats.technical.length > 0) {
    parts.push(`技术栈包含 ${categoryStats.technical.length} 项技术`)
  }
  if (categoryStats.softSkills.length > 0) {
    parts.push(`需要 ${categoryStats.softSkills.length} 项软技能`)
  }
  if (categoryStats.tools.length > 0) {
    parts.push(`涉及 ${categoryStats.tools.length} 个工具`)
  }
  
  return parts.join('，')
}