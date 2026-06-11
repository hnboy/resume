<template>
  <div class="job-match-page">
    <div class="page-header">
      <h2>岗位匹配分析</h2>
      <p>智能分析岗位需求，生成针对性简历建议</p>
    </div>

    <div class="main-content">
      <div class="form-section">
        <el-card title="选择简历">
          <el-select v-model="selectedResumeId" placeholder="请选择简历">
            <el-option 
              v-for="resume in resumes" 
              :key="resume.id" 
              :label="resume.basicInfo?.name || '未命名简历'" 
              :value="resume.id" 
            />
          </el-select>
          <el-button v-if="!resumes.length" type="primary" @click="goToCreate">创建简历</el-button>
        </el-card>

        <el-card title="岗位描述">
          <el-textarea 
            v-model="jobDescription" 
            placeholder="请粘贴岗位描述或JD内容..." 
            :rows="8"
          />
          <div class="suggestions-section">
            <p class="suggestions-label">热门岗位参考：</p>
            <div class="suggestions-tags">
              <el-tag 
                v-for="suggestion in suggestions" 
                :key="suggestion.id" 
                @click="applySuggestion(suggestion)"
              >
                {{ suggestion.title }}
              </el-tag>
            </div>
          </div>
        </el-card>

        <el-button type="primary" size="large" @click="analyzeJob" :disabled="!jobDescription || !selectedResumeId">
          开始匹配分析
        </el-button>
      </div>

      <div v-if="analysisResult" class="result-section">
        <el-card title="匹配度分析" class="result-card">
          <div class="match-score">
            <div class="score-circle">
              <span class="score-value">{{ analysisResult.percentage }}%</span>
            </div>
            <p class="score-label">岗位匹配度</p>
          </div>

          <div class="match-details">
            <div class="detail-item">
              <span class="detail-label">匹配关键词</span>
              <div class="detail-tags">
                <el-tag v-for="kw in analysisResult.matchedKeywords" :key="kw" type="success">
                  {{ kw }}
                </el-tag>
              </div>
            </div>

            <div class="detail-item">
              <span class="detail-label">缺失关键词</span>
              <div class="detail-tags">
                <el-tag v-for="kw in analysisResult.missingKeywords" :key="kw" type="warning">
                  {{ kw }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <el-card title="优化建议" class="result-card">
          <div v-for="(suggestion, index) in analysisResult.suggestions" :key="index" class="suggestion-item">
            <span class="suggestion-icon">💡</span>
            <span class="suggestion-text">{{ suggestion.message }}</span>
          </div>
        </el-card>

        <el-card title="岗位关键词分析" class="result-card">
          <div v-if="jobAnalysis" class="analysis-tags">
            <div class="analysis-group">
              <span class="group-label">技术栈</span>
              <div class="group-tags">
                <el-tag v-for="kw in jobAnalysis.categoryStats.technical" :key="kw">{{ kw }}</el-tag>
              </div>
            </div>
            <div class="analysis-group">
              <span class="group-label">软技能</span>
              <div class="group-tags">
                <el-tag v-for="kw in jobAnalysis.categoryStats.softSkills" :key="kw">{{ kw }}</el-tag>
              </div>
            </div>
            <div class="analysis-group">
              <span class="group-label">工具</span>
              <div class="group-tags">
                <el-tag v-for="kw in jobAnalysis.categoryStats.tools" :key="kw">{{ kw }}</el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <div class="result-actions">
          <el-button type="primary" @click="generateTargetedResume">生成针对性简历</el-button>
          <el-button @click="goToEdit">编辑简历</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { resumeApi, jobApi } from '../utils/api'

const resumes = ref([])
const selectedResumeId = ref('')
const jobDescription = ref('')
const suggestions = ref([])
const analysisResult = ref(null)
const jobAnalysis = ref(null)

const fetchResumes = async () => {
  try {
    const response = await resumeApi.getAll()
    resumes.value = response.data.data
  } catch (error) {
    console.error('获取简历列表失败:', error)
  }
}

const fetchSuggestions = async () => {
  try {
    const response = await jobApi.getSuggestions()
    suggestions.value = response.data.data
  } catch (error) {
    console.error('获取岗位建议失败:', error)
  }
}

const applySuggestion = (suggestion) => {
  const keywords = suggestion.keywords.join('、')
  jobDescription.value = `岗位职责：\n- 熟练掌握${keywords}\n- 有相关项目经验者优先\n- 良好的团队协作能力`
}

const analyzeJob = async () => {
  try {
    const [matchResponse, analysisResponse] = await Promise.all([
      jobApi.match(selectedResumeId.value, jobDescription.value),
      jobApi.analyze(jobDescription.value)
    ])
    analysisResult.value = matchResponse.data.data
    jobAnalysis.value = analysisResponse.data.data
  } catch (error) {
    alert('分析失败，请重试')
  }
}

const generateTargetedResume = async () => {
  try {
    const response = await resumeApi.generate(selectedResumeId.value, jobDescription.value)
    alert('针对性简历生成成功！')
    window.location.href = `/preview/${selectedResumeId.value}`
  } catch (error) {
    alert('生成失败，请重试')
  }
}

const goToCreate = () => {
  window.location.href = '/create'
}

const goToEdit = () => {
  window.location.href = `/edit/${selectedResumeId.value}`
}

onMounted(() => {
  fetchResumes()
  fetchSuggestions()
})
</script>

<style scoped>
.job-match-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 28px;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.form-section > .el-card {
  margin-bottom: 20px;
}

.suggestions-section {
  margin-top: 16px;
}

.suggestions-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.suggestions-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
}

.result-card {
  margin-bottom: 20px;
}

.match-score {
  text-align: center;
  margin-bottom: 20px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.score-value {
  font-size: 28px;
  font-weight: bold;
  color: white;
}

.score-label {
  font-size: 14px;
  color: #666;
}

.match-details {
  margin-top: 20px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: #fff7e6;
  border-radius: 8px;
  margin-bottom: 8px;
}

.suggestion-icon {
  font-size: 18px;
  margin-right: 8px;
}

.suggestion-text {
  font-size: 14px;
  color: #d48806;
}

.analysis-tags {
  margin-top: 16px;
}

.analysis-group {
  margin-bottom: 16px;
}

.group-label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
}
</style>