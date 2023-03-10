
drop function get_totals

select get_totals('2022-12-01','2022-12-31')  


CREATE OR REPLACE FUNCTION public.get_totals(start_date timestamp,end_date timestamp)
 RETURNS TABLE(project bigint, team bigint, employee bigint,event_sub_type varchar,no_of_days NUMERIC)
 LANGUAGE plpgsql
AS $function$
begin
	 RETURN QUERY
    select
--	e."start",
	emp.project ,
	emp.team ,
	e.employee ,
	e.sub_type ,
--	event_filter.event_start,
--	event_filter.event_end,
	sum(extract(day
from
	(event_filter.event_end::timestamp - event_filter.event_start::timestamp)))
from
	events e join
	(
	select id,
		case
			when e.start::timestamp < get_totals.start_date
		then get_totals.start_date
			else
		start
		end event_start,
		case
			when e.end::timestamp > get_totals.end_date
		then get_totals.end_date
			else
		e.end
		end event_end
	from
		events e
	) as  event_filter on e.id = event_filter.id
--		join events e on event_filter.id = e.id
	join employees emp on e.employee =emp.id
where
	e.start <= get_totals.end_date and e.end >= get_totals.start_date
	group by emp.project ,emp.team ,e.employee ,e.sub_type ;
END; $function$
;




