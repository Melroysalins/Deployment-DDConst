import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getEmployees = async () =>
  axios
    .get('/employee/all', { url: '/employee/all', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
    .then((res) => res.data.map((item) => ({ ...item, collapsed: false })))
    .catch((err) => []);

export const listAllEvents = async () =>
  axios
    .get('/events/all', { url: '/events/all', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
    .then((res) => res.data)
    .catch((err) => []);

export const getAllProjects = async () =>
  axios
    .get('/sites/all', { url: '/sites/all', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
    .then((res) => {
      let data = res.data;
      data = data.map((item) => ({ text: item.location, value: item.id }));
      return data;
    })
    .catch((err) => []);

export const createNewProject = async (data) =>
  axios
    .post('/sites/add', data, { url: '/sites/add', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
    .then((res) => res)
    .catch((err) => []);

export const createNewEvent = async (data) =>
  axios
    .post('/events/add', data, {
      url: '/events/add',
      baseURL: API_URL,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    .then((res) => res)
    .catch((err) => []);

export const deleteEvent = async (id) =>
  axios
    .delete(`/events/delete/${id}`, {
      url: `/events/delete/${id}`,
      baseURL: API_URL,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    .then((res) => res)
    .catch((err) => []);
