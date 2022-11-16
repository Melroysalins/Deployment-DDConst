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
          name: 'BQS Co., Ltd. Iljin Electric _ 345kV Samcheok thermal power plant mass-produced collective energy facility',
          children: [
            {
              id: '166511763212',
              name: 'Installation Team 1',
              children: [
                {
                  id: '1665117632',
                  name: 'C - Employee_LJH - Team Lead',
                  // children: [
                  //   { id: 'day', name: 'day' },
                  //   { id: 'night', name: 'night' },
                  // ],
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
            {
              id: 'ins_1665117632',
              name: 'Installation Team 2',
              // children: [
              //   { id: 'day', name: 'day' },
              //   { id: 'night', name: 'night' },
              // ],
              collapsed: true,
            },
            {
              id: '32',
              name: 'Connection Team',
              // children: [
              //   { id: 'day', name: 'day' },
              //   { id: 'night', name: 'night' },
              // ],
              collapsed: true,
            },
          ],
        },
      ];
      return data;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });

export const getAllEvents = async () => {
  const { data1, error } = await supabase
    .from('event')
    .select('id,start,end,title,location:site_id(location,color),resource:employee_id()');
  if (error) {
    return 0;
  }
  const data = [
    {
      id: 16651176321,
      start: '2022-10-23',
      end: '2022-11-24',
      title:
        'Teams involved: Installation Team (Inhouse), Installation Team (Outstource), Connection team (Inhouse)',
      resource: '1665117388',
      color: '#FFFFFF',
    },
    {
      id:1763212334343,
      start: '2022-10-23',
      end: '2022-11-24',
      title:
        'Employees: 이준호 이준호 이준호, Tasks: 6, Lodging days: 57, Meals: 64, Return loging days: 8, Return meals: 8, Moves: 8, Overtime: 1, Night time: 1, Move on rest day: 1',
      resource: '166511763212',
      color: '#FFFFFF',
    },
    {
      id: 1665117632,
      start: '2022-10-23',
      end: '2022-11-24',
      title: '31 Lodging days',
      resource: '1665117632',
      color: '#FFA58D',
    },
    {
      id: 1665117632,
      start: '2022-10-29',
      end: '2022-11-30',
      title: '30 Meals',
      resource: '1665117632',
      color: '#85CDB7',
    },
    {
      id: 1665117632123,
      start: '2022-10-29',
      end: '2022-11-30',
      title: 'MF1- MF3',
      resource: '1665117632',
      color: '#FFFFFF',
    },
  ];
  console.log(data);
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
