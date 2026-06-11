const axios = require('axios')

class AIAgent {
  constructor() {
    this.baseURL = process.env.AI_API_URL || 'https://api.openai.com/v1'
    this.apiKey = process.env.AI_API_KEY || ''
    this.model = process.env.AI_MODEL || 'gpt-3.5-turbo'
  }

  async generateResume(basicInfo, education, experience, skills, projects, targetJob = '') {
    const prompt = this.buildResumePrompt(basicInfo, education, experience, skills, projects, targetJob)
    
    try {
      const response = await this.callAI(prompt)
      return this.parseResumeResponse(response)
    } catch (error) {
      console.error('AI resume generation failed:', error)
      return this.generateMockResume(basicInfo, education, experience, skills, projects, targetJob)
    }
  }

  async optimizeResume(resume, jobDescription) {
    const prompt = this.buildOptimizePrompt(resume, jobDescription)
    
    try {
      const response = await this.callAI(prompt)
      return response.data.choices[0].message.content.trim()
    } catch (error) {
      console.error('AI resume optimization failed:', error)
      return this.generateMockOptimization(resume, jobDescription)
    }
  }

  async analyzeJobDescription(jobDescription) {
    const prompt = this.buildJobAnalysisPrompt(jobDescription)
    
    try {
      const response = await this.callAI(prompt)
      return JSON.parse(response.data.choices[0].message.content)
    } catch (error) {
      console.error('AI job analysis failed:', error)
      return this.generateMockJobAnalysis(jobDescription)
    }
  }

  async generateSummary(text) {
    const prompt = `请用简洁的语言总结以下内容：\n\n${text}\n\n总结：`
    
    try {
      const response = await this.callAI(prompt)
      return response.data.choices[0].message.content.trim()
    } catch (error) {
      console.error('AI summary generation failed:', error)
      return text.substring(0, 100) + '...'
    }
  }

  async generateBulletPoints(experience) {
    const prompt = `请将以下工作经历转换成简洁的项目符号列表，突出量化成果：\n\n${experience}\n\n项目符号列表：`
    
    try {
      const response = await this.callAI(prompt)
      return response.data.choices[0].message.content.trim()
    } catch (error) {
      console.error('AI bullet points generation failed:', error)
      return `- ${experience}`
    }
  }

  buildResumePrompt(basicInfo, education, experience, skills, projects, targetJob) {
    return `
你是一位专业的简历撰写顾问。请根据以下信息为${basicInfo.name || '用户'}生成一份专业的${targetJob || '通用'}岗位简历。

基本信息：
- 姓名：${basicInfo.name || ''}
- 目标职位：${basicInfo.title || ''}
- 邮箱：${basicInfo.email || ''}
- 电话：${basicInfo.phone || ''}
- 个人简介：${basicInfo.summary || ''}

教育背景：
${education.map((e, i) => `${i + 1}. ${e.school || ''} - ${e.major || ''} (${e.period || ''})`).join('\n') || '暂无'}

工作/实习经历：
${experience.map((e, i) => `${i + 1}. ${e.company || ''} - ${e.position || ''} (${e.period || ''})\n   ${e.description || ''}`).join('\n\n') || '暂无'}

技能：
${skills.map(s => `${s.name} - ${s.level}`).join('\n') || '暂无'}

项目经验：
${projects.map((p, i) => `${i + 1}. ${p.name || ''} - ${p.role || ''}\n   ${p.description || ''}\n   技术栈：${p.techStack || ''}`).join('\n\n') || '暂无'}

请输出结构化的简历内容，包含：
1. 优化后的个人简介
2. 核心竞争力要点（3-5点）
3. 工作经历的量化成果描述
4. 技能亮点总结

输出格式：JSON格式，包含 summary、strengths、experience_points、skill_highlights 字段。
    `.trim()
  }

  buildOptimizePrompt(resume, jobDescription) {
    return `
你是一位专业的职业顾问。请根据以下岗位描述，为这份简历提供优化建议。

岗位描述：
${jobDescription}

简历内容：
${JSON.stringify(resume, null, 2)}

请分析：
1. 简历与岗位的匹配度
2. 需要增加或修改的内容
3. 关键词建议
4. 排版优化建议

请用中文输出详细的优化建议。
    `.trim()
  }

  buildJobAnalysisPrompt(jobDescription) {
    return `
请分析以下岗位描述，提取关键信息并以 JSON 格式输出。

岗位描述：
${jobDescription}

输出格式：
{
  "title": "职位名称",
  "required_skills": ["技能1", "技能2", ...],
  "preferred_skills": ["技能1", "技能2", ...],
  "responsibilities": ["职责1", "职责2", ...],
  "requirements": ["要求1", "要求2", ...],
  "keywords": ["关键词1", "关键词2", ...],
  "difficulty": "初级/中级/高级",
  "industry": "行业名称"
}
    `.trim()
  }

  async callAI(prompt) {
    if (!this.apiKey) {
      throw new Error('AI API key not configured')
    }

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    }

    const data = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: '你是一位专业的简历撰写和职业规划顾问，精通中英文简历撰写，熟悉各行各业的招聘要求。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    }

    return await axios.post(`${this.baseURL}/chat/completions`, data, { headers })
  }

  parseResumeResponse(response) {
    const content = response.data.choices[0].message.content
    try {
      return JSON.parse(content)
    } catch {
      return {
        summary: content,
        strengths: [],
        experience_points: [],
        skill_highlights: []
      }
    }
  }

  generateMockResume(basicInfo, education, experience, skills, projects, targetJob) {
    const strengths = [
      `${basicInfo.name || '求职者'}具有扎实的专业基础`,
      '良好的团队协作能力和沟通能力',
      '较强的学习能力和适应能力',
      '具备相关项目实践经验'
    ]

    const experience_points = experience.map((exp, i) => {
      return `${i + 1}. 在${exp.company || '某公司'}担任${exp.position || '某职位'}期间，负责核心业务模块开发，提升工作效率`
    })

    const skill_highlights = skills.slice(0, 3).map(s => `${s.name} - ${s.level}`)

    return {
      summary: `${basicInfo.name || '求职者'}是一位${basicInfo.title || '优秀的专业人才'}，拥有${education.length > 0 ? education[0].degree || '' : ''}学历，在${experience.length > 0 ? experience[0].company || '' : '相关领域'}有丰富经验。目标岗位：${targetJob || '待定'}。`,
      strengths,
      experience_points: experience_points.length > 0 ? experience_points : ['暂无工作经历'],
      skill_highlights: skill_highlights.length > 0 ? skill_highlights : ['暂无技能信息']
    }
  }

  generateMockOptimization(resume, jobDescription) {
    return `
优化建议：

1. 匹配度分析：
- 简历中已包含部分与岗位相关的技能和经验
- 建议加强与岗位描述中关键词的匹配

2. 内容优化建议：
- 建议在工作经历中增加量化成果描述
- 突出与目标岗位相关的项目经验
- 优化个人简介，突出核心竞争力

3. 关键词建议：
- 建议添加：${jobDescription.split(/[,，、\n]/).slice(0, 5).map(w => w.trim()).filter(Boolean).join('、')}

4. 排版建议：
- 使用清晰的项目符号列表
- 保持简历在1-2页以内
- 使用专业简洁的字体和格式
    `.trim()
  }

  generateMockJobAnalysis(jobDescription) {
    const keywords = jobDescription.toLowerCase().match(/(java|python|javascript|react|vue|spring|mysql|sql|html|css|node\.js|git)/g) || []
    
    return {
      title: jobDescription.substring(0, 30) + '...',
      required_skills: [...new Set(keywords)].slice(0, 5),
      preferred_skills: ['团队协作', '沟通能力', '项目管理'],
      responsibilities: ['负责相关开发工作', '参与团队协作', '完成项目任务'],
      requirements: ['相关学历背景', '相关工作经验', '良好的学习能力'],
      keywords: [...new Set(keywords)].slice(0, 8),
      difficulty: '中级',
      industry: '互联网/IT'
    }
  }
}

module.exports = new AIAgent()