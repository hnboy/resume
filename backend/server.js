const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const resumeRoutes = require('./routes/resume')
const jobRoutes = require('./routes/job')

const app = express()
const PORT = process.env.PORT || 3000

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/resumes', resumeRoutes)
app.use('/api/jobs', jobRoutes)

app.get('/', (req, res) => {
  res.json({ message: '简历生成器后端服务运行中' })
})

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})