import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getEmployees = async () => {
    return axios
        .get('/employee/all', { url: '/employee/all', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((res) => {
            return res.data.map((item) => {
                return { ...item, collapsed: false };
            });
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
};
export const getAllEvents = async () => {
    return axios
        .get('/events/all', { url: '/events/all', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((res) => res.data)
        .catch((err) => {
            console.log(err);
            return [];
        });
};
export const getAllProjects = async () => {
    return axios
        .get('/sites/all', { url: '/sites/all', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((res) => {
            let data = res.data;
            data = data.map((item) => {
                return { text: item.location, value: item.id };
            });
            return data;
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
};
export const createNewProject = async (data) => {
    return axios
        .post('/sites/add', data, { url: '/sites/add', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((res) => {
            console.log(res);
            return res;
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
};
export const createNewEvent = async (data) => {
    return axios
        .post('/events/add', data, { url: '/events/add', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((res) => {
            console.log(res);
            return res;
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
};
export const deleteEvent = async (id) => {
    return axios
        .delete(`/events/delete/${id}`, { url: `/events/delete/${id}`, baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((res) => {
            console.log(res);
            return res;
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
};
