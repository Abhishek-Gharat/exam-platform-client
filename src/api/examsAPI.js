import axiosInstance, { mockApi } from './axiosInstance';

export var examsAPI = {
  getPublishedExams: async function() {
    if (mockApi.isActive) {
      await mockApi.ready; await mockApi.delay(400);
      return { data: mockApi.exams().publishedExams };
    }
    return await axiosInstance.get('/exams/published');
  },

  getAllExams: async function() {
    if (mockApi.isActive) {
      await mockApi.ready; await mockApi.delay(400);
      return { data: mockApi.exams().allExams };
    }
    return await axiosInstance.get('/exams');
  },

  getExamById: async function(id) {
    if (mockApi.isActive) {
      await mockApi.ready; await mockApi.delay(300);
      var exam = mockApi.exams().allExams.find(function(e) { return e.id === id; });
      if (!exam) throw { response: { data: { message: 'Not found' } } };
      return { data: exam };
    }
    return await axiosInstance.get('/exams/' + id);
  },

  createExam: async function(data) {
    if (mockApi.isActive) {
      await mockApi.delay(600);
      return { data: Object.assign({ id: 'exam-' + Date.now(), status: 'DRAFT' }, data) };
    }
    return await axiosInstance.post('/exams', data);
  },

  updateExam: async function(id, data) {
    if (mockApi.isActive) {
      await mockApi.delay(500);
      return { data: Object.assign({ id: id }, data) };
    }
    return await axiosInstance.put('/exams/' + id, data);
  },

  deleteExam: async function(id) {
    if (mockApi.isActive) { await mockApi.delay(400); return { data: { message: 'Deleted' } }; }
    return await axiosInstance.delete('/exams/' + id);
  },

  publishExam: async function(id) {
    if (mockApi.isActive) { await mockApi.delay(400); return { data: { message: 'Published' } }; }
    return await axiosInstance.patch('/exams/' + id + '/publish');
  }
};