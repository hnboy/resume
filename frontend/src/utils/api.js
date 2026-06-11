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

export default api