const baseUrl = 'http://localhost:3000/api'

export const resumeApi = {
  getAll: () => uni.request({
    url: `${baseUrl}/resumes`,
    method: 'GET'
  }),
  getById: (id: string) => uni.request({
    url: `${baseUrl}/resumes/${id}`,
    method: 'GET'
  }),
  create: (data: any) => uni.request({
    url: `${baseUrl}/resumes`,
    method: 'POST',
    data
  }),
  update: (id: string, data: any) => uni.request({
    url: `${baseUrl}/resumes/${id}`,
    method: 'PUT',
    data
  }),
  delete: (id: string) => uni.request({
    url: `${baseUrl}/resumes/${id}`,
    method: 'DELETE'
  }),
  generate: (id: string, jobDescription: string) => uni.request({
    url: `${baseUrl}/resumes/${id}/generate`,
    method: 'POST',
    data: { jobDescription }
  })
}

export const jobApi = {
  match: (resumeId: string, jobDescription: string) => uni.request({
    url: `${baseUrl}/jobs/match`,
    method: 'POST',
    data: { resumeId, jobDescription }
  }),
  analyze: (jobDescription: string) => uni.request({
    url: `${baseUrl}/jobs/analyze`,
    method: 'POST',
    data: { jobDescription }
  }),
  getSuggestions: () => uni.request({
    url: `${baseUrl}/jobs/suggestions`,
    method: 'GET'
  })
}

export const aiApi = {
  generateResume: (data: any) => uni.request({
    url: `${baseUrl}/ai/generate`,
    method: 'POST',
    data
  }),
  optimizeResume: (resumeId: string, jobDescription: string) => uni.request({
    url: `${baseUrl}/ai/optimize`,
    method: 'POST',
    data: { resumeId, jobDescription }
  }),
  analyzeJob: (jobDescription: string) => uni.request({
    url: `${baseUrl}/ai/analyze-job`,
    method: 'POST',
    data: { jobDescription }
  }),
  generateSummary: (text: string) => uni.request({
    url: `${baseUrl}/ai/summary`,
    method: 'POST',
    data: { text }
  }),
  generateBulletPoints: (experience: string) => uni.request({
    url: `${baseUrl}/ai/bullet-points`,
    method: 'POST',
    data: { experience }
  })
}