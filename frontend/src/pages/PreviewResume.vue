<template>
  <div class="preview-resume-page">
    <div class="preview-header">
      <h2>简历预览</h2>
      <div class="header-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="downloadResume">下载 PDF</el-button>
      </div>
    </div>

    <div class="resume-container">
      <div class="resume" ref="resumeRef">
        <div class="resume-header">
          <h1>{{ resume.basicInfo?.name }}</h1>
          <p>{{ resume.basicInfo?.title }}</p>
        </div>

        <div class="resume-contact">
          <span v-if="resume.basicInfo?.email">{{ resume.basicInfo.email }}</span>
          <span v-if="resume.basicInfo?.phone">{{ resume.basicInfo.phone }}</span>
          <span v-if="resume.basicInfo?.address">{{ resume.basicInfo.address }}</span>
        </div>

        <div v-if="resume.basicInfo?.summary" class="resume-section">
          <h3 class="section-title">个人简介</h3>
          <p>{{ resume.basicInfo.summary }}</p>
        </div>

        <div v-if="resume.education?.length" class="resume-section">
          <h3 class="section-title">教育背景</h3>
          <div v-for="(edu, index) in resume.education" :key="index" class="section-item">
            <div class="item-header">
              <span class="item-title">{{ edu.school }}</span>
              <span class="item-date">{{ edu.period }}</span>
            </div>
            <p class="item-subtitle">{{ edu.degree }} · {{ edu.major }}</p>
            <p v-if="edu.description" class="item-desc">{{ edu.description }}</p>
          </div>
        </div>

        <div v-if="resume.experience?.length" class="resume-section">
          <h3 class="section-title">工作/实习经历</h3>
          <div v-for="(exp, index) in resume.experience" :key="index" class="section-item">
            <div class="item-header">
              <span class="item-title">{{ exp.company }}</span>
              <span class="item-date">{{ exp.period }}</span>
            </div>
            <p class="item-subtitle">{{ exp.position }}</p>
            <p v-if="exp.description" class="item-desc">{{ exp.description }}</p>
          </div>
        </div>

        <div v-if="resume.projects?.length" class="resume-section">
          <h3 class="section-title">项目经验</h3>
          <div v-for="(project, index) in resume.projects" :key="index" class="section-item">
            <div class="item-header">
              <span class="item-title">{{ project.name }}</span>
              <span class="item-subtitle">{{ project.role }}</span>
            </div>
            <p v-if="project.description" class="item-desc">{{ project.description }}</p>
            <p v-if="project.techStack" class="item-tech">技术栈：{{ project.techStack }}</p>
          </div>
        </div>

        <div v-if="resume.skills?.length" class="resume-section">
          <h3 class="section-title">技能</h3>
          <div class="skills-container">
            <span 
              v-for="(skill, index) in resume.skills" 
              :key="index" 
              class="skill-tag"
              :class="{ highlighted: skill.highlighted }"
            >
              {{ skill.name }} {{ skill.level }}
            </span>
          </div>
        </div>

        <div v-if="resume.awards?.length" class="resume-section">
          <h3 class="section-title">获奖情况</h3>
          <div v-for="(award, index) in resume.awards" :key="index" class="award-item">
            <span class="award-name">{{ award.name }}</span>
            <span class="award-date">{{ award.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { resumeApi } from '../utils/api'

const route = useRoute()
const resumeRef = ref(null)

const resume = ref({
  basicInfo: {},
  education: [],
  experience: [],
  skills: [],
  projects: [],
  awards: []
})

const fetchResume = async () => {
  try {
    const response = await resumeApi.getById(route.params.id)
    resume.value = response.data.data
  } catch (error) {
    console.error('获取简历失败:', error)
  }
}

const goBack = () => {
  window.location.href = '/'
}

const downloadResume = () => {
  alert('PDF下载功能开发中...')
}

onMounted(fetchResume)
</script>

<style scoped>
.preview-resume-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.resume-container {
  display: flex;
  justify-content: center;
}

.resume {
  width: 210mm;
  min-height: 297mm;
  background: white;
  padding: 25mm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.resume-header {
  text-align: center;
  margin-bottom: 16px;
}

.resume-header h1 {
  font-size: 28px;
  margin: 0;
  color: #333;
}

.resume-header p {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0;
}

.resume-contact {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #409EFF;
  margin-bottom: 16px;
  font-size: 12px;
  color: #666;
}

.resume-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid #409EFF;
}

.section-item {
  margin-bottom: 12px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.item-title {
  font-weight: bold;
  color: #333;
}

.item-date {
  font-size: 12px;
  color: #999;
}

.item-subtitle {
  font-size: 12px;
  color: #666;
  margin: 2px 0 4px;
}

.item-desc {
  font-size: 12px;
  line-height: 1.6;
  color: #444;
  margin: 0;
}

.item-tech {
  font-size: 11px;
  color: #409EFF;
  margin: 4px 0 0;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 4px 12px;
  background: #f0f5ff;
  border-radius: 4px;
  font-size: 12px;
  color: #409EFF;
}

.skill-tag.highlighted {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.award-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.award-name {
  color: #333;
}

.award-date {
  color: #999;
}
</style>