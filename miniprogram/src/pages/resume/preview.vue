<template>
  <view class="page">
    <view class="preview-header">
      <text class="header-title">简历预览</text>
      <view class="header-actions">
        <text class="action-btn" @click="goBack">返回</text>
        <text class="action-btn primary">下载 PDF</text>
      </view>
    </view>

    <scroll-view scroll-y class="resume-scroll">
      <view class="resume">
        <view class="resume-header">
          <text class="name">{{ resume.basicInfo?.name }}</text>
          <text class="title">{{ resume.basicInfo?.title }}</text>
        </view>

        <view class="contact">
          <text v-if="resume.basicInfo?.email">{{ resume.basicInfo.email }}</text>
          <text v-if="resume.basicInfo?.phone">{{ resume.basicInfo.phone }}</text>
        </view>

        <view v-if="resume.basicInfo?.summary" class="section">
          <text class="section-title">个人简介</text>
          <text class="section-content">{{ resume.basicInfo.summary }}</text>
        </view>

        <view v-if="resume.education?.length" class="section">
          <text class="section-title">教育背景</text>
          <view v-for="(edu, index) in resume.education" :key="index" class="item">
            <view class="item-header">
              <text class="item-title">{{ edu.school }}</text>
              <text class="item-date">{{ edu.period }}</text>
            </view>
            <text class="item-subtitle">{{ edu.degree }} · {{ edu.major }}</text>
            <text v-if="edu.description" class="item-content">{{ edu.description }}</text>
          </view>
        </view>

        <view v-if="resume.experience?.length" class="section">
          <text class="section-title">工作/实习经历</text>
          <view v-for="(exp, index) in resume.experience" :key="index" class="item">
            <view class="item-header">
              <text class="item-title">{{ exp.company }}</text>
              <text class="item-date">{{ exp.period }}</text>
            </view>
            <text class="item-subtitle">{{ exp.position }}</text>
            <text v-if="exp.description" class="item-content">{{ exp.description }}</text>
          </view>
        </view>

        <view v-if="resume.projects?.length" class="section">
          <text class="section-title">项目经验</text>
          <view v-for="(project, index) in resume.projects" :key="index" class="item">
            <view class="item-header">
              <text class="item-title">{{ project.name }}</text>
              <text class="item-subtitle">{{ project.role }}</text>
            </view>
            <text v-if="project.description" class="item-content">{{ project.description }}</text>
            <text v-if="project.techStack" class="item-tech">技术栈：{{ project.techStack }}</text>
          </view>
        </view>

        <view v-if="resume.skills?.length" class="section">
          <text class="section-title">技能</text>
          <view class="skills">
            <text 
              v-for="(skill, index) in resume.skills" 
              :key="index" 
              class="skill-tag"
            >
              {{ skill.name }} {{ skill.level }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { resumeApi } from '../../utils/api'

const resume = ref({
  basicInfo: {},
  education: [],
  experience: [],
  skills: [],
  projects: []
})

const fetchResume = async (id: string) => {
  uni.showLoading({ title: '加载中...' })
  try {
    const response = await resumeApi.getById(id)
    if (response.statusCode === 200) {
      resume.value = response.data.data
    }
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
    console.error('获取简历失败:', error)
  }
}

const goBack = () => {
  uni.navigateBack()
}

onLoad((options: any) => {
  fetchResume(options.id)
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: white;
}

.header-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 30rpx;
}

.action-btn {
  font-size: 28rpx;
  color: #666;
  
  &.primary {
    color: #667eea;
    font-weight: bold;
  }
}

.resume-scroll {
  height: calc(100vh - 100rpx);
  padding: 20rpx;
}

.resume {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
}

.resume-header {
  text-align: center;
  padding-bottom: 30rpx;
  border-bottom: 4rpx solid #667eea;
  margin-bottom: 20rpx;
}

.name {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.title {
  font-size: 28rpx;
  color: #666;
}

.contact {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  color: #666;
}

.section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
  padding-left: 15rpx;
  border-left: 6rpx solid #667eea;
}

.section-content {
  font-size: 26rpx;
  line-height: 1.6;
  color: #444;
}

.item {
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 5rpx;
}

.item-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.item-date {
  font-size: 24rpx;
  color: #999;
}

.item-subtitle {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.item-content {
  font-size: 26rpx;
  line-height: 1.6;
  color: #444;
  display: block;
}

.item-tech {
  font-size: 24rpx;
  color: #667eea;
  display: block;
  margin-top: 10rpx;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.skill-tag {
  padding: 10rpx 20rpx;
  background: #f0f5ff;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #667eea;
}
</style>