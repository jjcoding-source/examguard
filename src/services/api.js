import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('examguard_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401) {
      
      localStorage.removeItem('examguard_token')
      localStorage.removeItem('examguard_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {

  login: (credentials) =>
    api.post('/auth/login', credentials),

}

export const examAPI = {

  getAll: () =>
    api.get('/exams'),

  getById: (id) =>
    api.get(`/exams/${id}`),

  create: (data) =>
    api.post('/exams', data),

  update: (id, data) =>
    api.put(`/exams/${id}`, data),

  delete: (id) =>
    api.delete(`/exams/${id}`),

  getQuestions: (examId) =>
    api.get(`/exams/${examId}/questions`),

}

export const sessionAPI = {

  start: (examId) =>
    api.post('/sessions/start', { examId }),

  submit: (sessionId, answers) =>
    api.post(`/sessions/${sessionId}/submit`, { answers }),

  getById: (id) =>
    api.get(`/sessions/${id}`),

  getByExam: (examId) =>
    api.get(`/sessions/exam/${examId}`),

  getMy: () =>
    api.get('/sessions/my'),

}

export const proctorAPI = {

  logEvent: (eventData) =>
    api.post('/proctor/event', eventData),

  getEvents: (sessionId) =>
    api.get(`/proctor/session/${sessionId}/events`),

  terminate: (sessionId) =>
    api.post(`/proctor/session/${sessionId}/terminate`),

}

export const adminAPI = {

  getUsers: () =>
    api.get('/admin/users'),

  createUser: (data) =>
    api.post('/admin/users', data),

  updateUser: (id, data) =>
    api.put(`/admin/users/${id}`, data),

  toggleUser: (id) =>
    api.patch(`/admin/users/${id}/toggle`),

  getStats: () =>
    api.get('/admin/stats'),

}

export default api