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