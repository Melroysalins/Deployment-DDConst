
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
