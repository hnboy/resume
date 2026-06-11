<template>
  <div class="create-resume-page">
    <el-form ref="formRef" :model="form" label-width="120px" class="resume-form">
      <el-card title="基本信息" class="form-section">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.basicInfo.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="职位" prop="title">
          <el-input v-model="form.basicInfo.title" placeholder="请输入目标职位" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.basicInfo.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.basicInfo.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.basicInfo.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="个人简介" prop="summary">
          <el-textarea v-model="form.basicInfo.summary" placeholder="请输入个人简介" :rows="3" />
        </el-form-item>
      </el-card>

      <el-card title="教育背景" class="form-section">
        <div v-for="(edu, index) in form.education" :key="index">
          <div class="section-header">
            <span>教育经历 {{ index + 1 }}</span>
            <el-button v-if="form.education.length > 1" size="small" type="danger" @click="removeEdu(index)">删除</el-button>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'学校'" :prop="`education[${index}].school`">
                <el-input v-model="edu.school" placeholder="请输入学校名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'学历'" :prop="`education[${index}].degree`">
                <el-select v-model="edu.degree" placeholder="请选择学历">
                  <el-option label="大专" value="大专" />
                  <el-option label="本科" value="本科" />
                  <el-option label="硕士" value="硕士" />
                  <el-option label="博士" value="博士" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'专业'" :prop="`education[${index}].major`">
                <el-input v-model="edu.major" placeholder="请输入专业" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'时间段'" :prop="`education[${index}].period`">
                <el-input v-model="edu.period" placeholder="例如：2019-2023" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="'描述'" :prop="`education[${index}].description`">
            <el-textarea v-model="edu.description" placeholder="请输入教育经历描述" :rows="2" />
          </el-form-item>
        </div>
        <el-button size="small" type="primary" @click="addEdu">添加教育经历</el-button>
      </el-card>

      <el-card title="工作/实习经历" class="form-section">
        <div v-for="(exp, index) in form.experience" :key="index">
          <div class="section-header">
            <span>经历 {{ index + 1 }}</span>
            <el-button v-if="form.experience.length > 1" size="small" type="danger" @click="removeExp(index)">删除</el-button>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'公司/机构'" :prop="`experience[${index}].company`">
                <el-input v-model="exp.company" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'职位'" :prop="`experience[${index}].position`">
                <el-input v-model="exp.position" placeholder="请输入职位" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="'时间段'" :prop="`experience[${index}].period`">
            <el-input v-model="exp.period" placeholder="例如：2021-2023" />
          </el-form-item>
          <el-form-item :label="'工作职责'" :prop="`experience[${index}].description`">
            <el-textarea v-model="exp.description" placeholder="请输入工作职责和成就" :rows="4" />
          </el-form-item>
        </div>
        <el-button size="small" type="primary" @click="addExp">添加经历</el-button>
      </el-card>

      <el-card title="技能" class="form-section">
        <div v-for="(skill, index) in form.skills" :key="index">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'技能名称'" :prop="`skills[${index}].name`">
                <el-input v-model="skill.name" placeholder="例如：Java" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'熟练度'" :prop="`skills[${index}].level`">
                <el-select v-model="skill.level" placeholder="请选择熟练度">
                  <el-option label="初级" value="初级" />
                  <el-option label="中级" value="中级" />
                  <el-option label="高级" value="高级" />
                  <el-option label="精通" value="精通" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-button v-if="form.skills.length > 1" size="small" type="danger" @click="removeSkill(index)">删除</el-button>
          </el-row>
        </div>
        <el-button size="small" type="primary" @click="addSkill">添加技能</el-button>
      </el-card>

      <el-card title="项目经验" class="form-section">
        <div v-for="(project, index) in form.projects" :key="index">
          <div class="section-header">
            <span>项目 {{ index + 1 }}</span>
            <el-button v-if="form.projects.length > 1" size="small" type="danger" @click="removeProject(index)">删除</el-button>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'项目名称'" :prop="`projects[${index}].name`">
                <el-input v-model="project.name" placeholder="请输入项目名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'角色'" :prop="`projects[${index}].role`">
                <el-input v-model="project.role" placeholder="请输入担任角色" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="'项目描述'" :prop="`projects[${index}].description`">
            <el-textarea v-model="project.description" placeholder="请输入项目描述" :rows="3" />
          </el-form-item>
          <el-form-item :label="'技术栈'" :prop="`projects[${index}].techStack`">
            <el-input v-model="project.techStack" placeholder="例如：Java, Spring Boot, MySQL" />
          </el-form-item>
        </div>
        <el-button size="small" type="primary" @click="addProject">添加项目</el-button>
      </el-card>

      <el-card title="获奖情况" class="form-section">
        <div v-for="(award, index) in form.awards" :key="index">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'奖项名称'" :prop="`awards[${index}].name`">
                <el-input v-model="award.name" placeholder="请输入奖项名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'获得时间'" :prop="`awards[${index}].date`">
                <el-input v-model="award.date" placeholder="例如：2022年" />
              </el-form-item>
            </el-col>
            <el-button v-if="form.awards.length > 1" size="small" type="danger" @click="removeAward(index)">删除</el-button>
          </el-row>
        </div>
        <el-button size="small" type="primary" @click="addAward">添加奖项</el-button>
      </el-card>

      <div class="form-actions">
        <el-button type="primary" @click="submitForm">保存简历</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { resumeApi } from '../utils/api'

const formRef = ref(null)

const form = reactive({
  basicInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    summary: ''
  },
  education: [
    { school: '', degree: '', major: '', period: '', description: '' }
  ],
  experience: [
    { company: '', position: '', period: '', description: '' }
  ],
  skills: [
    { name: '', level: '' }
  ],
  projects: [
    { name: '', role: '', description: '', techStack: '' }
  ],
  awards: [
    { name: '', date: '' }
  ]
})

const addEdu = () => {
  form.education.push({ school: '', degree: '', major: '', period: '', description: '' })
}

const removeEdu = (index) => {
  form.education.splice(index, 1)
}

const addExp = () => {
  form.experience.push({ company: '', position: '', period: '', description: '' })
}

const removeExp = (index) => {
  form.experience.splice(index, 1)
}

const addSkill = () => {
  form.skills.push({ name: '', level: '' })
}

const removeSkill = (index) => {
  form.skills.splice(index, 1)
}

const addProject = () => {
  form.projects.push({ name: '', role: '', description: '', techStack: '' })
}

const removeProject = (index) => {
  form.projects.splice(index, 1)
}

const addAward = () => {
  form.awards.push({ name: '', date: '' })
}

const removeAward = (index) => {
  form.awards.splice(index, 1)
}

const submitForm = async () => {
  try {
    await resumeApi.create(form)
    alert('简历保存成功')
    window.location.href = '/'
  } catch (error) {
    alert('保存失败，请重试')
  }
}

const goBack = () => {
  window.location.href = '/'
}
</script>

<style scoped>
.create-resume-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
}
</style>