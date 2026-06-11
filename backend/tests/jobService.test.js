/**
 * jobService 单元测试
 *
 * 覆盖要点：
 *  1. analyzeJob 能从岗位描述中正确提取技术/软技能关键词
 *  2. matchJob 能返回匹配度、百分比、匹配/缺失关键词与优化建议
 *  3. getSuggestions 返回预设岗位列表
 *  4. matchJob 当简历不存在时抛出明确错误（保证接口行为一致）
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-job-test-'))

// 隔离 resumeService 的数据文件，避免污染生产数据
process.env.STORAGE_DIR = path.relative(path.join(__dirname, '..'), TMP_DIR)

const jobService = require('../services/jobService')
const resumeService = require('../services/resumeService')

afterAll(() => {
  try { fs.rmSync(TMP_DIR, { recursive: true, force: true }) } catch (_) {}
})

describe('jobService.getSuggestions', () => {
  test('返回至少 3 个预设岗位建议，每项具有 id / title / keywords', async () => {
    const suggestions = await jobService.getSuggestions()
    expect(Array.isArray(suggestions)).toBe(true)
    expect(suggestions.length).toBeGreaterThanOrEqual(3)
    suggestions.forEach(item => {
      expect(item).toEqual(expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        keywords: expect.any(Array)
      }))
    })
  })
})

describe('jobService.analyzeJob', () => {
  test('从岗位描述中提取 JavaScript / Vue / 团队协作 等关键词', async () => {
    const desc = '熟练使用 JavaScript Vue 进行前端开发，具备良好的团队协作与沟通能力'
    const result = await jobService.analyzeJob(desc)

    expect(result).toHaveProperty('keywords')
    expect(Array.isArray(result.keywords)).toBe(true)
    expect(result.keywords).toEqual(expect.arrayContaining(['JavaScript', 'Vue', '团队协作']))
  })

  test('返回对象包含关键词数量与分类统计信息', async () => {
    const desc = '熟练使用 Java Spring MySQL，具备良好的团队协作与沟通能力'
    const result = await jobService.analyzeJob(desc)

    expect(typeof result.keywordCount).toBe('number')
    expect(result.keywordCount).toBe(result.keywords.length)
    expect(Array.isArray(result.categoryStats.technical)).toBe(true)
    expect(Array.isArray(result.categoryStats.softSkills)).toBe(true)
    expect(result.categoryStats.technical.length).toBeGreaterThan(0)
    expect(result.categoryStats.softSkills.length).toBeGreaterThan(0)
  })

  test('未包含任何已知关键词时返回空 keywords 数组', async () => {
    const result = await jobService.analyzeJob('这是一个没有技术关键词的描述文本')
    expect(result.keywords).toEqual([])
    expect(result.keywordCount).toBe(0)
  })
})

describe('jobService.matchJob', () => {
  let sampleResume

  beforeAll(async () => {
    sampleResume = await resumeService.createResume({
      name: '张三',
      title: '前端工程师',
      skills: [
        { name: 'JavaScript', level: '熟练' },
        { name: 'Vue', level: '熟练' },
        { name: 'CSS', level: '了解' }
      ],
      experience: [
        { company: 'A 公司', position: '前端工程师', description: '使用 JavaScript 和 Vue 开发业务系统' }
      ]
    })
  })

  test('匹配结果结构完整，包含 matchScore、percentage、关键词与建议', async () => {
    const result = await jobService.matchJob(
      sampleResume.id,
      '熟练使用 JavaScript Vue，具备团队协作能力'
    )

    expect(typeof result.matchScore).toBe('number')
    expect(typeof result.percentage).toBe('number')
    expect(Array.isArray(result.matchedKeywords)).toBe(true)
    expect(Array.isArray(result.missingKeywords)).toBe(true)
    expect(Array.isArray(result.suggestions)).toBe(true)
  })

  test('匹配到 JavaScript / Vue 关键词出现在 matchedKeywords 中', async () => {
    const result = await jobService.matchJob(
      sampleResume.id,
      '熟练使用 JavaScript Vue，具备团队协作能力'
    )
    expect(result.matchedKeywords).toEqual(expect.arrayContaining(['JavaScript', 'Vue']))
  })

  test('岗位描述中存在但简历缺失的 React 会出现在 missingKeywords', async () => {
    const result = await jobService.matchJob(
      sampleResume.id,
      '熟练使用 React JavaScript'
    )
    expect(result.missingKeywords).toEqual(expect.arrayContaining(['React']))
    expect(result.matchedKeywords).toEqual(expect.arrayContaining(['JavaScript']))
  })

  test('传入不存在的 resumeId 时抛出明确错误', async () => {
    await expect(
      jobService.matchJob('non-existent-id-12345', '任何描述')
    ).rejects.toThrow(/简历/)
  })

  test('百分比值在 0 - 100 之间', async () => {
    const result = await jobService.matchJob(
      sampleResume.id,
      'Java Python Go Rust 这些与简历无关的技能'
    )
    expect(result.percentage).toBeGreaterThanOrEqual(0)
    expect(result.percentage).toBeLessThanOrEqual(100)
  })
})
