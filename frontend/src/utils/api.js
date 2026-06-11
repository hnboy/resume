import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export const resumeApi = {
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  generate: (id, jobDescription) => api.post(`/resumes/${id}/generate`, { jobDescription })
}

export const jobApi = {
  match: (resumeId, jobDescription) => api.post('/jobs/match', { resumeId, jobDescription }),
  analyze: (jobDescription) => api.post('/jobs/analyze', { jobDescription }),
  getSuggestions: () => api.get('/jobs/suggestions')
}

export const aiApi = {
  generateResume: (data) => api.post('/ai/generate', data),
  optimizeResume: (resumeId, jobDescription) => api.post('/ai/optimize', { resumeId, jobDescription }),
  analyzeJob: (jobDescription) => api.post('/ai/analyze-job', { jobDescription }),
  generateSummary: (text) => api.post('/ai/summary', { text }),
  generateBulletPoints: (experience) => api.post('/ai/bullet-points', { experience })
}

export default api