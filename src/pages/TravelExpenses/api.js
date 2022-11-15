import axios from 'axios';
import { supabase } from '../../supabaseClient';

const API_URL = process.env.REACT_APP_API_URL;
// const API_URL_2 = 'https://excellent-dev-o5dtk.cloud.serverless.com';

const API_URL_2 = 'https://happy-binary-ixun0.cloud.serverless.com';

export const getEmployees = async () =>
  axios
    .get('/employee/all', {
      url: '/employee/all122',
      baseURL: API_URL_2,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    .then((res) => {
      // return res.data.map((item) => {
      //     return { ...item, collapsed: false };
      // });
      const data = [
        {
          id: '1665117388',
          created_at: '2022-10-07T04:36:53.21846+00:00',
          name: 'Iljin Power Tech',
          children: [
            {
              id: '1665117632',
              name: 'Employee_LJH',
              children: [
                { id: 'day', name: 'day' },
                { id: 'night', name: 'night' },
              ],
              collapsed: true,
            },
            {
              id: '1665117678',
              name: 'Employee_LSH',
            },
            {
              id: '1665117756',
              name: 'Employee_LYJ',
            },
            {
              id: '1665117812',
              name: 'Employee_JHL',
            },
          ],
          collapsed: false,
        },
      ];
      return data;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });

export const getAllEvents = async () => {
  const { data, error } = await supabase
    .from('event')
    .select('id,start,end,title,location:site_id(location,color),resource:employee_id()');
  if (error) {
    return 0;
  }
  return data;
};

export const getAllProjects = async () =>
  axios
    .get('/sites/all', { url: '/sites/all', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
    .then((res) => {
      let data = res.data;
      data = data.map((item) => ({ text: item.location, value: item.id }));
      return data;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });

export const createNewProject = async (data) =>
  axios
    .post('/sites/add', data, { url: '/sites/add', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      return [];
    });

export const createNewEvent = async (data) =>
  axios
    .post('/events/add', data, {
      url: '/events/add',
      baseURL: API_URL,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      return [];
    });

export const deleteEvent = async (id) =>
  axios
    .delete(`/events/delete/${id}`, {
      url: `/events/delete/${id}`,
      baseURL: API_URL,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      return [];
    });
