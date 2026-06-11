// ========== API 基础地址配置 ==========
// 生产环境部署时，将 YOUR_SERVER_IP 替换为实际服务器地址
// 例如: 'http://192.168.1.100:3000/api' 或 'https://resume.example.com/api'
// 开发环境保持 localhost 即可
const DEV_BASE_URL = 'http://localhost:3000/api'
const PROD_BASE_URL = 'http://YOUR_SERVER_IP:3000/api'

// 根据编译模式自动切换
// 注意：小程序需要在微信公众平台配置 request 合法域名
const baseUrl = process.env.NODE_ENV === 'production' ? PROD_BASE_URL : DEV_BASE_URL

// 也可以使用 uni.getSystemInfoSync().platform 来判断是否真机
// 或直接从全局配置读取
// const baseUrl = (getApp() as any)?.globalData?.apiBaseUrl || DEV_BASE_URL
// =======================================

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