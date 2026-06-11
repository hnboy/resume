<template>
  <div class="home-page">
    <header class="header">
      <div class="header-content">
        <h1>简历生成器</h1>
        <p>专为毕业生打造，智能生成针对性简历</p>
      </div>
    </header>

    <main class="main-content">
      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <h3>快速创建</h3>
          <p>简单几步即可创建专业简历</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>岗位匹配</h3>
          <p>智能分析岗位需求，生成针对性简历</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>多端支持</h3>
          <p>Web、小程序多平台同步使用</p>
        </div>
      </div>

      <div class="action-section">
        <el-button type="primary" size="large" @click="goToCreate">
          创建简历
        </el-button>
        <el-button size="large" @click="goToJobMatch">
          岗位匹配分析
        </el-button>
      </div>

      <div class="resume-list" v-if="resumes.length > 0">
        <h2>我的简历</h2>
        <div class="resume-grid">
          <el-card 
            v-for="resume in resumes" 
            :key="resume.id" 
            class="resume-card"
          >
            <div class="resume-header">
              <h3>{{ resume.basicInfo?.name || '未命名简历' }}</h3>
              <span class="resume-date">{{ formatDate(resume.updatedAt) }}</span>
            </div>
            <p class="resume-desc">{{ resume.basicInfo?.title || '暂无职位信息' }}</p>
            <div class="resume-actions">
              <el-button size="small" @click="goToEdit(resume.id)">编辑</el-button>
              <el-button size="small" @click="goToPreview(resume.id)">预览</el-button>
              <el-button size="small" type="danger" @click="deleteResume(resume.id)">删除</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div class="empty-state" v-else>
        <div class="empty-icon">📄</div>
        <p>还没有简历，点击上方按钮创建</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { resumeApi } from '../utils/api'

const resumes = ref([])

const fetchResumes = async () => {
  try {
    const response = await resumeApi.getAll()
    resumes.value = response.data.data
  } catch (error) {
    console.error('获取简历列表失败:', error)
  }
}

const goToCreate = () => {
  window.location.href = '/create'
}

const goToJobMatch = () => {
  window.location.href = '/job-match'
}

const goToEdit = (id) => {
  window.location.href = `/edit/${id}`
}

const goToPreview = (id) => {
  window.location.href = `/preview/${id}`
}

const deleteResume = async (id) => {
  if (confirm('确定要删除这份简历吗？')) {
    try {
      await resumeApi.delete(id)
      fetchResumes()
      alert('删除成功')
    } catch (error) {
      alert('删除失败')
    }
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(fetchResumes)
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.header h1 {
  font-size: 48px;
  margin-bottom: 16px;
  font-weight: 600;
}

.header p {
  font-size: 18px;
  opacity: 0.9;
}

.main-content {
  background: white;
  border-radius: 20px 20px 0 0;
  margin-top: -40px;
  padding: 40px 20px;
  min-height: calc(100vh - 180px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto 40px;
}

.feature-card {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  margin-bottom: 8px;
  font-size: 18px;
}

.feature-card p {
  color: #666;
}

.action-section {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.resume-list {
  max-width: 1200px;
  margin: 0 auto;
}

.resume-list h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.resume-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.resume-card {
  transition: transform 0.2s;
}

.resume-card:hover {
  transform: translateY(-4px);
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.resume-header h3 {
  margin: 0;
  font-size: 18px;
}

.resume-date {
  font-size: 12px;
  color: #999;
}

.resume-desc {
  color: #666;
  margin-bottom: 16px;
}

.resume-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
}
</style>