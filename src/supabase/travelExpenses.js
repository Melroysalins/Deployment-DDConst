import { supabase } from 'lib/api';

export const getTeResources = async () => {
  const { data: projects, error } = await supabase
    .from('projects_teams_employees')
    .select('*')
    .not('teams', 'is', null);
  const { data: teamEmployees, error: error2 } = await supabase
    .from('teams_employees')
    .select('*')
    .not('employees', 'is', null);
  if (error || error2) {
    console.log('in error');
    return error;
  }
  const returnData = projects.map((project) => ({
    id: `project_|${project.id}`,
    projectTitle: project.title,
    branchTitle: project.title,
    children: project.teams.map((team) => {
      const { employees } = teamEmployees.find((e) => e.id === team.id) || {};
      return {
        id: `team_ |${team.id}`,
        // "created_at": "2022-10-07T04:37:36.062981+00:00",
        name: team.name,
        team_type: team.type,
        start: team.start,
        end: team.end,
        children: employees,
      };
    }),
  }));
  // console.log(inspect(returnData, true, 5));
  return returnData;
};
