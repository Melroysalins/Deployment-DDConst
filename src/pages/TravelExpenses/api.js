import axios from 'axios';
import { supabase } from '../../supabaseClient';

const API_URL = process.env.REACT_APP_API_URL;
// const API_URL_2 = 'https://excellent-dev-o5dtk.cloud.serverless.com';

const API_URL_2 = 'https://happy-binary-ixun0.cloud.serverless.com';

export const getEmployees = async () => {
  return axios
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
          name: '154kV Jinju-Hadong Underground T/L Construction Work (Iljin Electric)',
          children: [
            {
              id: '1665117632',
              name: 'Employee_LJH',
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
      ];
      return data;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};
export const getAllEvents = async () => {
  const { data1, error } = await supabase
    .from('event')
    .select('id,start,end,title,location:site_id(location,color),resource:employee_id()');
  if (error) {
    return 0;
  }
  const data = [
    {
        "id": 1665117632,
        "start": "2022-10-23",
        "end": "2022-11-24",
        "title": "31 Lodging days",
        "resource": "1665117632",
        "location": {
            "location": "move",
            "color": "#FFA58D"
        }
    },
    {
        "id": 1665117632,
        "start": "2022-10-29",
        "end": "2022-11-30",
        "title": "30 Meals",
        "resource": "1665117632",
        "location": {
            "location": "move",
            "color": "#FFA58D"
        }
    },
    {
      "id": 1665117632,
      "start": "2022-10-23",
      "end": "2022-11-24",
      "title": "31 Lodging days",
      "resource": "1665117678",
      "location": {
          "location": "move",
          "color": "#FFA58D"
      }
  },
  {
      "id": 1665117632,
      "start": "2022-10-29",
      "end": "2022-11-30",
      "title": "30 Meals",
      "resource": "1665117678",
      "location": {
          "location": "move",
          "color": "#FFA58D"
      }
  },
    
]
  console.log(data);
  return data;

  // return axios
  //     .get('/events/all', { url: '/events/all', baseURL: API_URL, headers: { 'Access-Control-Allow-Origin': '*' } })
  //     .then((res) => res.data)
  //     .catch((err) => {
  //         console.log(err);
  //         return [];
  //     });
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
    .post('/events/add', data, {
      url: '/events/add',
      baseURL: API_URL,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
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
    .delete(`/events/delete/${id}`, {
      url: `/events/delete/${id}`,
      baseURL: API_URL,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};
