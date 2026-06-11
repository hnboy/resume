<template>
  <view class="page">
    <view class="header">
      <text class="title">岗位匹配分析</text>
      <text class="subtitle">智能分析岗位需求，优化简历内容</text>
    </view>

    <view class="main">
      <view class="card">
        <text class="card-title">选择简历</text>
        <picker 
          :value="resumeIndex" 
          :range="resumeNames" 
          @change="(e: any) => selectedResumeId = resumes[e.detail.value]?.id || ''"
        >
          <view class="picker-view">
            {{ selectedResumeId ? resumes.find(r => r.id === selectedResumeId)?.basicInfo?.name || '请选择简历' : '请选择简历' }}
          </view>
        </picker>
        <button v-if="!resumes.length" class="btn-primary small" @click="goToCreate">创建简历</button>
      </view>

      <view class="card">
        <text class="card-title">岗位描述</text>
        <textarea 
          class="textarea" 
          v-model="jobDescription" 
          placeholder="请粘贴岗位描述或JD内容..."
        />
        <view class="suggestions">
          <text class="suggestions-label">热门岗位参考：</text>
          <view class="suggestions-tags">
            <text 
              v-for="suggestion in suggestions" 
              :key="suggestion.id" 
              class="tag"
              @click="applySuggestion(suggestion)"
            >
              {{ suggestion.title }}
            </text>
          </view>
        </view>
      </view>

      <button 
        class="btn-primary full" 
        @click="analyzeJob"
        :disabled="!jobDescription || !selectedResumeId"
      >
        开始匹配分析
      </button>

      <view v-if="analysisResult" class="result">
        <view class="result-card">
          <text class="result-title">匹配度分析</text>
          <view class="score-container">
            <view class="score-circle">
              <text class="score-value">{{ analysisResult.percentage }}%</text>
            </view>
            <text class="score-label">岗位匹配度</text>
          </view>

          <view class="match-details">
            <view class="detail-item">
              <text class="detail-label">匹配关键词</text>
              <view class="detail-tags">
                <text v-for="kw in analysisResult.matchedKeywords" :key="kw" class="tag success">
                  {{ kw }}
                </text>
              </view>
            </view>

            <view class="detail-item">
              <text class="detail-label">缺失关键词</text>
              <view class="detail-tags">
                <text v-for="kw in analysisResult.missingKeywords" :key="kw" class="tag warning">
                  {{ kw }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="result-card">
          <text class="result-title">优化建议</text>
          <view v-for="(suggestion, index) in analysisResult.suggestions" :key="index" class="suggestion-item">
            <text class="suggestion-icon">💡</text>
            <text class="suggestion-text">{{ suggestion.message }}</text>
          </view>
        </view>

        <view class="result-actions">
          <button class="btn-primary" @click="generateResume">生成针对性简历</button>
          <button class="btn-secondary" @click="goToEdit">编辑简历</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { resumeApi, jobApi } from '../../utils/api'

const resumes = ref<any[]>([])
const selectedResumeId = ref('')
const jobDescription = ref('')
const suggestions = ref<any[]>([])
const analysisResult = ref<any>(null)

const resumeIndex = computed(() => {
  return resumes.value.findIndex(r => r.id === selectedResumeId.value)
})

const resumeNames = computed(() => {
  return resumes.value.map(r => r.basicInfo?.name || '未命名简历')
})

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

const fetchSuggestions = async () => {
  try {
    const response = await jobApi.getSuggestions()
    if (response.statusCode === 200) {
      suggestions.value = response.data.data
    }
  } catch (error) {
    console.error('获取岗位建议失败:', error)
  }
}

const applySuggestion = (suggestion: any) => {
  const keywords = suggestion.keywords.join('、')
  jobDescription.value = `岗位职责：\n- 熟练掌握${keywords}\n- 有相关项目经验者优先\n- 良好的团队协作能力`
}

const analyzeJob = async () => {
  uni.showLoading({ title: '分析中...' })
  try {
    const response = await jobApi.match(selectedResumeId.value, jobDescription.value)
    if (response.statusCode === 200) {
      analysisResult.value = response.data.data
    }
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '分析失败', icon: 'error' })
  }
}

const generateResume = async () => {
  uni.showLoading({ title: '生成中...' })
  try {
    const response = await resumeApi.generate(selectedResumeId.value, jobDescription.value)
    if (response.statusCode === 200) {
      uni.hideLoading()
      uni.showToast({ title: '生成成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateTo({ url: `/pages/resume/preview?id=${selectedResumeId.value}` })
      }, 1500)
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '生成失败', icon: 'error' })
  }
}

const goToCreate = () => {
  uni.navigateTo({ url: '/pages/resume/create' })
}

const goToEdit = () => {
  uni.navigateTo({ url: `/pages/resume/edit?id=${selectedResumeId.value}` })
}

onMounted(() => {
  fetchResumes()
  fetchSuggestions()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx;
  text-align: center;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.main {
  padding: 30rpx;
  margin-top: -30rpx;
}

.card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.picker-view {
  height: 80rpx;
  padding: 0 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  color: #666;
}

.textarea {
  width: 100%;
  height: 240rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.suggestions {
  margin-top: 20rpx;
}

.suggestions-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 15rpx;
}

.suggestions-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.tag {
  padding: 10rpx 20rpx;
  background: #f0f5ff;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #667eea;
  
  &.success {
    background: #e8f5e9;
    color: #4caf50;
  }
  
  &.warning {
    background: #fff8e1;
    color: #ff9800;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 40rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  
  &.small {
    width: 100%;
    margin-top: 20rpx;
  }
  
  &.full {
    width: 100%;
    margin-bottom: 20rpx;
  }
}

.btn-secondary {
  background: #f5f7fa;
  color: #666;
  border: 2rpx solid #e8e8e8;
  border-radius: 40rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
}

.result {
  margin-top: 20rpx;
}

.result-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.result-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.score-container {
  text-align: center;
  margin-bottom: 30rpx;
}

.score-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15rpx;
}

.score-value {
  font-size: 40rpx;
  font-weight: bold;
  color: white;
}

.score-label {
  font-size: 26rpx;
  color: #666;
}

.match-details {
  margin-top: 20rpx;
}

.detail-item {
  margin-bottom: 20rpx;
}

.detail-label {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background: #fff7e6;
  border-radius: 12rpx;
  margin-bottom: 15rpx;
}

.suggestion-icon {
  font-size: 32rpx;
  margin-right: 15rpx;
}

.suggestion-text {
  font-size: 26rpx;
  color: #d48806;
  line-height: 1.6;
}

.result-actions {
  display: flex;
  gap: 20rpx;
}

.result-actions button {
  flex: 1;
}
</style>