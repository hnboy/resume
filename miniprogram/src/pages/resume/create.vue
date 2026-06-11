<template>
  <view class="page">
    <view v-if="showAI" class="ai-assistant">
      <view class="ai-header">
        <text class="ai-icon">🤖</text>
        <text class="ai-title">AI 智能助手</text>
        <text class="ai-close" @click="showAI = false">×</text>
      </view>
      <view class="ai-options">
        <view class="ai-option" @click="aiGenerateSummary">
          <text class="option-icon">✍️</text>
          <text class="option-text">生成个人简介</text>
        </view>
        <view class="ai-option" @click="aiGenerateBulletPoints">
          <text class="option-icon">📋</text>
          <text class="option-text">生成经历要点</text>
        </view>
        <view class="ai-option" @click="aiOptimizeResume">
          <text class="option-icon">✨</text>
          <text class="option-text">优化简历内容</text>
        </view>
      </view>
    </view>

    <view class="page-header">
      <text class="page-title">创建简历</text>
      <text class="ai-toggle" @click="showAI = !showAI">🤖 AI助手</text>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">基本信息</text>
      </view>

      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" v-model="form.basicInfo.name" placeholder="请输入姓名" />
      </view>

      <view class="form-item">
        <text class="form-label">目标职位</text>
        <input class="form-input" v-model="form.basicInfo.title" placeholder="请输入目标职位" />
      </view>

      <view class="form-item">
        <text class="form-label">邮箱</text>
        <input class="form-input" v-model="form.basicInfo.email" placeholder="请输入邮箱" />
      </view>

      <view class="form-item">
        <text class="form-label">电话</text>
        <input class="form-input" v-model="form.basicInfo.phone" placeholder="请输入手机号" />
      </view>

      <view class="form-item">
        <text class="form-label">个人简介</text>
        <textarea class="form-textarea" v-model="form.basicInfo.summary" placeholder="请输入个人简介" />
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">教育背景</text>
        <text class="add-btn" @click="addEdu">+ 添加</text>
      </view>

      <view v-for="(edu, index) in form.education" :key="index" class="sub-form">
        <view class="form-item">
          <text class="form-label">学校</text>
          <input class="form-input" v-model="edu.school" placeholder="请输入学校名称" />
        </view>
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">学历</text>
            <picker :value="degreeIndex(index)" :range="degrees" @change="(e: any) => edu.degree = degrees[e.detail.value]">
              <view class="picker-view">
                {{ edu.degree || '请选择' }}
              </view>
            </picker>
          </view>
          <view class="form-item half">
            <text class="form-label">专业</text>
            <input class="form-input" v-model="edu.major" placeholder="请输入专业" />
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">时间段</text>
          <input class="form-input" v-model="edu.period" placeholder="例如：2019-2023" />
        </view>
        <text v-if="form.education.length > 1" class="remove-btn" @click="removeEdu(index)">删除</text>
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">工作/实习经历</text>
        <text class="add-btn" @click="addExp">+ 添加</text>
      </view>

      <view v-for="(exp, index) in form.experience" :key="index" class="sub-form">
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">公司</text>
            <input class="form-input" v-model="exp.company" placeholder="请输入公司名称" />
          </view>
          <view class="form-item half">
            <text class="form-label">职位</text>
            <input class="form-input" v-model="exp.position" placeholder="请输入职位" />
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">时间段</text>
          <input class="form-input" v-model="exp.period" placeholder="例如：2021-2023" />
        </view>
        <view class="form-item">
          <text class="form-label">工作职责</text>
          <textarea class="form-textarea" v-model="exp.description" placeholder="请输入工作职责和成就" />
        </view>
        <text v-if="form.experience.length > 1" class="remove-btn" @click="removeExp(index)">删除</text>
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">技能</text>
        <text class="add-btn" @click="addSkill">+ 添加</text>
      </view>

      <view v-for="(skill, index) in form.skills" :key="index" class="sub-form">
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">技能名称</text>
            <input class="form-input" v-model="skill.name" placeholder="例如：Java" />
          </view>
          <view class="form-item half">
            <text class="form-label">熟练度</text>
            <picker :value="levelIndex(index)" :range="levels" @change="(e: any) => skill.level = levels[e.detail.value]">
              <view class="picker-view">
                {{ skill.level || '请选择' }}
              </view>
            </picker>
          </view>
        </view>
        <text v-if="form.skills.length > 1" class="remove-btn" @click="removeSkill(index)">删除</text>
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">项目经验</text>
        <text class="add-btn" @click="addProject">+ 添加</text>
      </view>

      <view v-for="(project, index) in form.projects" :key="index" class="sub-form">
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">项目名称</text>
            <input class="form-input" v-model="project.name" placeholder="请输入项目名称" />
          </view>
          <view class="form-item half">
            <text class="form-label">角色</text>
            <input class="form-input" v-model="project.role" placeholder="请输入担任角色" />
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">项目描述</text>
          <textarea class="form-textarea" v-model="project.description" placeholder="请输入项目描述" />
        </view>
        <view class="form-item">
          <text class="form-label">技术栈</text>
          <input class="form-input" v-model="project.techStack" placeholder="例如：Java, Spring Boot" />
        </view>
        <text v-if="form.projects.length > 1" class="remove-btn" @click="removeProject(index)">删除</text>
      </view>
    </view>

    <view class="form-actions">
      <button class="btn-primary" @click="submitForm">保存简历</button>
      <button class="btn-secondary" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { resumeApi, aiApi } from '../../utils/api'

const degrees = ['大专', '本科', '硕士', '博士']
const levels = ['初级', '中级', '高级', '精通']
const showAI = ref(false)

const form = reactive({
  basicInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    summary: ''
  },
  education: [{ school: '', degree: '', major: '', period: '', description: '' }],
  experience: [{ company: '', position: '', period: '', description: '' }],
  skills: [{ name: '', level: '' }],
  projects: [{ name: '', role: '', description: '', techStack: '' }]
})

const degreeIndex = (index: number) => {
  return degrees.indexOf(form.education[index].degree)
}

const levelIndex = (index: number) => {
  return levels.indexOf(form.skills[index].level)
}

const addEdu = () => {
  form.education.push({ school: '', degree: '', major: '', period: '', description: '' })
}

const removeEdu = (index: number) => {
  form.education.splice(index, 1)
}

const addExp = () => {
  form.experience.push({ company: '', position: '', period: '', description: '' })
}

const removeExp = (index: number) => {
  form.experience.splice(index, 1)
}

const addSkill = () => {
  form.skills.push({ name: '', level: '' })
}

const removeSkill = (index: number) => {
  form.skills.splice(index, 1)
}

const addProject = () => {
  form.projects.push({ name: '', role: '', description: '', techStack: '' })
}

const removeProject = (index: number) => {
  form.projects.splice(index, 1)
}

const submitForm = async () => {
  uni.showLoading({ title: '保存中...' })
  try {
    const response = await resumeApi.create(form)
    if (response.statusCode === 201) {
      uni.hideLoading()
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '保存失败', icon: 'error' })
  }
}

const goBack = () => {
  uni.navigateBack()
}

const aiGenerateSummary = async () => {
  uni.showLoading({ title: '生成中...' })
  try {
    const text = `姓名：${form.basicInfo.name}，职位：${form.basicInfo.title}，技能：${form.skills.map(s => s.name).join('、')}`
    const response = await aiApi.generateSummary(text)
    if (response.statusCode === 200) {
      form.basicInfo.summary = response.data.data.summary
      uni.hideLoading()
      uni.showToast({ title: '生成成功', icon: 'success' })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '生成失败', icon: 'error' })
  }
}

const aiGenerateBulletPoints = async () => {
  uni.showLoading({ title: '生成中...' })
  try {
    const experienceText = form.experience.map(e => `${e.company} - ${e.position}：${e.description}`).join('；')
    const response = await aiApi.generateBulletPoints(experienceText)
    if (response.statusCode === 200 && form.experience.length > 0) {
      form.experience[0].description = response.data.data.bulletPoints
      uni.hideLoading()
      uni.showToast({ title: '生成成功', icon: 'success' })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '生成失败', icon: 'error' })
  }
}

const aiOptimizeResume = async () => {
  uni.showLoading({ title: '优化中...' })
  try {
    const response = await aiApi.generateResume({
      basicInfo: form.basicInfo,
      education: form.education,
      experience: form.experience,
      skills: form.skills,
      projects: form.projects,
      targetJob: form.basicInfo.title
    })
    if (response.statusCode === 200) {
      const result = response.data.data
      if (result.summary) {
        form.basicInfo.summary = result.summary
      }
      uni.hideLoading()
      uni.showToast({ title: '优化成功', icon: 'success' })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '优化失败', icon: 'error' })
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20rpx;
  background: #f5f7fa;
  min-height: 100vh;
}

.ai-assistant {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.ai-icon {
  font-size: 40rpx;
}

.ai-title {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}

.ai-close {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.8);
  padding: 0 20rpx;
}

.ai-options {
  display: flex;
  gap: 20rpx;
}

.ai-option {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
}

.option-icon {
  font-size: 36rpx;
  display: block;
  margin-bottom: 10rpx;
}

.option-text {
  font-size: 24rpx;
  color: white;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.ai-toggle {
  font-size: 28rpx;
  color: #667eea;
  padding: 10rpx 20rpx;
  background: #f0f5ff;
  border-radius: 20rpx;
}

.form-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.add-btn {
  font-size: 28rpx;
  color: #667eea;
}

.sub-form {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.form-item {
  margin-bottom: 20rpx;
}

.form-item.half {
  flex: 1;
}

.form-row {
  display: flex;
  gap: 20rpx;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.picker-view {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  color: #666;
}

.remove-btn {
  font-size: 26rpx;
  color: #f56c6c;
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
  padding-bottom: 40rpx;
}

.form-actions button {
  flex: 1;
}
</style>