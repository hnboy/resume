/**
 * resumeService 单元测试
 *
 * 覆盖要点：
 *  1. 新建 / 查询 / 更新 / 删除简历
 *  2. 对不存在的 id 查询 / 更新 / 删除返回 null / false
 *  3. generateTargetedResume 能根据岗位描述为已有简历生成关键词与优化版本
 *  4. generateTargetedResume 对不存在的 id 抛出明确错误
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-service-test-'))
process.env.STORAGE_DIR = path.relative(path.join(__dirname, '..'), TMP_DIR)

const resumeService = require('../services/resumeService')

afterAll(() => {
  try { fs.rmSync(TMP_DIR, { recursive: true, force: true }) } catch (_) {}
})

describe('resumeService CRUD', () => {
  let resumeId

  test('createResume 创建一份简历并返回带 id / createdAt / updatedAt 的对象', async () => {
    const resume = await resumeService.createResume({
      name: '张三',
      title: '前端工程师',
      email: 'zhangsan@example.com',
      skills: [{ name: 'JavaScript', level: '熟练' }],
      experience: [{ company: 'A 公司', position: '前端工程师', description: '负责前端项目开发' }]
    })

    expect(resume).toEqual(expect.objectContaining({
      name: '张三',
      title: '前端工程师'
    }))
    expect(typeof resume.id).toBe('string')
    expect(resume.id.length).toBeGreaterThan(0)
    expect(typeof resume.createdAt).toBe('string')
    expect(typeof resume.updatedAt).toBe('string')

    resumeId = resume.id
  })

  test('getResumeById 能通过 id 查询刚创建的简历', async () => {
    const resume = await resumeService.getResumeById(resumeId)
    expect(resume).not.toBeNull()
    expect(resume.id).toBe(resumeId)
    expect(resume.name).toBe('张三')
  })

  test('getResumeById 对不存在的 id 返回 null', async () => {
    const resume = await resumeService.getResumeById('non-existent-id')
    expect(resume).toBeNull()
  })

  test('getAllResumes 返回数组，且至少包含刚才创建的简历', async () => {
    const all = await resumeService.getAllResumes()
    expect(Array.isArray(all)).toBe(true)
    expect(all.length).toBeGreaterThan(0)
    expect(all.some(r => r.id === resumeId)).toBe(true)
  })

  test('updateResume 能更新字段，并刷新 updatedAt', async () => {
    // 等待 1 毫秒，避免时间戳相同（不同机器时间精度不同）
    await new Promise(r => setTimeout(r, 2))

    const updated = await resumeService.updateResume(resumeId, {
      title: '高级前端工程师',
      email: 'new@example.com'
    })

    expect(updated).not.toBeNull()
    expect(updated.title).toBe('高级前端工程师')
    expect(updated.email).toBe('new@example.com')
    // name 等未传字段应保留原值
    expect(updated.name).toBe('张三')
    expect(updated.updatedAt).not.toBe(updated.createdAt)

    // 查询确认
    const fetched = await resumeService.getResumeById(resumeId)
    expect(fetched.title).toBe('高级前端工程师')
  })

  test('updateResume 对不存在的 id 返回 null', async () => {
    const result = await resumeService.updateResume('non-existent-id', { title: 'x' })
    expect(result).toBeNull()
  })

  test('deleteResume 能删除指定 id 的简历，并返回 true', async () => {
    const result = await resumeService.deleteResume(resumeId)
    expect(result).toBe(true)

    const fetched = await resumeService.getResumeById(resumeId)
    expect(fetched).toBeNull()
  })

  test('deleteResume 对不存在的 id 返回 false', async () => {
    const result = await resumeService.deleteResume('non-existent-id')
    expect(result).toBe(false)
  })
})

describe('resumeService.generateTargetedResume', () => {
  let resume

  beforeAll(async () => {
    resume = await resumeService.createResume({
      name: '李四',
      title: '全栈工程师',
      skills: [
        { name: 'JavaScript', level: '熟练' },
        { name: 'React', level: '熟练' },
        { name: 'Node.js', level: '熟练' }
      ],
      experience: [
        { company: 'B 公司', position: '前端工程师', description: '使用 React 开发 Web 应用' },
        { company: 'C 公司', position: '后端工程师', description: '使用 Node.js 开发 API' }
      ]
    })
  })

  test('根据岗位描述生成的定向简历包含 keywords 数组', async () => {
    const result = await resumeService.generateTargetedResume(
      resume.id,
      '熟练使用 React Node.js，具备良好的团队协作能力'
    )

    expect(Array.isArray(result.keywords)).toBe(true)
    expect(result.keywords).toEqual(expect.arrayContaining(['React', 'Node.js', '团队协作']))
  })

  test('定向简历会按相关度排序工作经历，首项应具备更高的 relevanceScore', async () => {
    const result = await resumeService.generateTargetedResume(
      resume.id,
      '使用 React 开发 Web 应用'
    )

    expect(Array.isArray(result.experience)).toBe(true)
    expect(result.experience.length).toBeGreaterThan(1)
    expect(result.experience[0].relevanceScore).toBeGreaterThanOrEqual(
      result.experience[result.experience.length - 1].relevanceScore
    )
  })

  test('定向简历的 skills 中 React 被标记为 highlighted: true', async () => {
    const result = await resumeService.generateTargetedResume(
      resume.id,
      'React 前端开发'
    )
    const reactSkill = result.skills.find(s => s.name === 'React')
    expect(reactSkill).toBeDefined()
    expect(reactSkill.highlighted).toBe(true)
  })

  test('定向简历包含 optimizedAt 时间戳字段', async () => {
    const result = await resumeService.generateTargetedResume(
      resume.id,
      'React 前端开发'
    )
    expect(typeof result.optimizedAt).toBe('string')
  })

  test('对不存在的 id 调用 generateTargetedResume 抛出明确错误', async () => {
    await expect(
      resumeService.generateTargetedResume('non-existent-id', '任何描述')
    ).rejects.toThrow(/简历/)
  })
})
