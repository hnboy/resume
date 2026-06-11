<template>
  <view class="page">
    <view class="header">
      <view class="header-content">
        <text class="title">简历生成器</text>
        <text class="subtitle">专为毕业生打造</text>
      </view>
    </view>

    <view class="main">
      <view class="features">
        <view class="feature-card">
          <text class="feature-icon">📝</text>
          <text class="feature-title">快速创建</text>
          <text class="feature-desc">简单几步完成简历</text>
        </view>
        <view class="feature-card">
          <text class="feature-icon">🎯</text>
          <text class="feature-title">岗位匹配</text>
          <text class="feature-desc">智能分析岗位需求</text>
        </view>
        <view class="feature-card">
          <text class="feature-icon">📱</text>
          <text class="feature-title">随时编辑</text>
          <text class="feature-desc">移动端便捷操作</text>
        </view>
      </view>

      <view class="actions">
        <button class="btn-primary" @click="goToCreate">创建简历</button>
        <button class="btn-secondary" @click="goToMatch">岗位匹配</button>
      </view>

      <view v-if="resumes.length > 0" class="resume-list">
        <text class="list-title">我的简历</text>
        <view v-for="resume in resumes" :key="resume.id" class="resume-item">
          <view class="resume-info">
            <text class="resume-name">{{ resume.basicInfo?.name || '未命名简历' }}</text>
            <text class="resume-date">{{ formatDate(resume.updatedAt) }}</text>
          </view>
          <view class="resume-actions">
            <text class="action-btn edit" @click="goToEdit(resume.id)">编辑</text>
            <text class="action-btn preview" @click="goToPreview(resume.id)">预览</text>
            <text class="action-btn delete" @click="deleteResume(resume.id)">删除</text>
          </view>
        </view>
      </view>

      <view v-else class="empty">
        <text class="empty-icon">📄</text>
        <text class="empty-text">还没有简历</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { resumeApi } from '../../utils/api'

const resumes = ref<any[]>([])

const fetchResumes = async () => {
  try {
    const response = await resumeApi.getAll()
    if (response.statusCode === 200) {
      resumes.value = response.data.data
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
  }
}

const goToCreate = () => {
  uni.navigateTo({ url: '/pages/resume/create' })
}

const goToMatch = () => {
  uni.switchTab({ url: '/pages/job/match' })
}

const goToEdit = (id: string) => {
  uni.navigateTo({ url: `/pages/resume/edit?id=${id}` })
}

const goToPreview = (id: string) => {
  uni.navigateTo({ url: `/pages/resume/preview?id=${id}` })
}

const deleteResume = (id: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这份简历吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const response = await resumeApi.delete(id)
          if (response.statusCode === 200) {
            uni.showToast({ title: '删除成功', icon: 'success' })
            fetchResumes()
          }
        } catch (error) {
          uni.showToast({ title: '删除失败', icon: 'error' })
        }
      }
    }
  })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(fetchResumes)
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  padding: 80rpx 40rpx 60rpx;
  text-align: center;
}

.title {
  font-size: 56rpx;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.main {
  background: white;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx;
  min-height: calc(100vh - 280rpx);
}

.features {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40rpx;
}

.feature-card {
  flex: 1;
  text-align: center;
  padding: 30rpx 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin: 0 10rpx;
}

.feature-icon {
  font-size: 56rpx;
  display: block;
  margin-bottom: 12rpx;
}

.feature-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.feature-desc {
  font-size: 22rpx;
  color: #999;
}

.actions {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.actions button {
  flex: 1;
}

.resume-list {
  margin-bottom: 20rpx;
}

.list-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.resume-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.resume-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.resume-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.resume-date {
  font-size: 24rpx;
  color: #999;
}

.resume-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  font-size: 24rpx;
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
}

.action-btn.edit {
  background: #e8f5e9;
  color: #4caf50;
}

.action-btn.preview {
  background: #e3f2fd;
  color: #2196f3;
}

.action-btn.delete {
  background: #ffebee;
  color: #f44336;
}

.empty {
  text-align: center;
  padding: 80rpx 0;
}

.empty-icon {
  font-size: 96rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>