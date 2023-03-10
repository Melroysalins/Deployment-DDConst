drop view projects_teams_employees;

create view projects_teams_employees as 
select
	p.id ,
	p.title,
	(
	select 
		jsonb_agg( distinct  jsonb_build_object('id',t.id,'name',t.name))
	from
		teams t join project_tasks pt on pt.team = t.id 
	where
		pt.project = p.id
	) teams
from
	projects p
	

drop view teams_employees 

create view teams_employees as
select
	t.id as t_id,
	t.name as t_name,
	(
	select
		json_agg( row_to_json(e))
	from
		employees e   
	where
		e.team = t.id
	) employees 
from teams t
select * from projects_teams_employees 
		
select * from teams_employees 
