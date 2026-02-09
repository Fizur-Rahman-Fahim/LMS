import api from './api';

export const courseService = {
    getCourses: async (params) => {
        const response = await api.get('/lms/courses/', { params });
        return response.data;
    },

    getCourse: async (id) => {
        const response = await api.get(`/lms/courses/${id}/`);
        return response.data;
    },

    createCourse: async (courseData) => {
        const response = await api.post('/lms/courses/', courseData);
        return response.data;
    },

    updateCourse: async (id, courseData) => {
        const response = await api.put(`/lms/courses/${id}/`, courseData);
        return response.data;
    },

    deleteCourse: async (id) => {
        await api.delete(`/lms/courses/${id}/`);
    },

    getMyCourses: async () => {
        const response = await api.get('/lms/courses/my_courses/');
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/lms/categories/');
        return response.data;
    },

    enrollInCourse: async (courseId) => {
        const response = await api.post('/lms/enrollments/', { course: courseId });
        return response.data;
    },

    getMyEnrollments: async () => {
        const response = await api.get('/lms/enrollments/my_enrollments/');
        return response.data;
    },

    getDashboardStats: async () => {
        const response = await api.get('/lms/dashboard/stats/');
        return response.data;
    },
};
