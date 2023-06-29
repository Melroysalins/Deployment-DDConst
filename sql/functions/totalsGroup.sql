select gt.team,gt.event_sub_type,sum(gt.no_of_days) from get_totals('2022-12-01','2022-12-31') gt group by gt.team ,gt.event_sub_type;

select * from get_totals('2022-12-01','2022-12-31') 

select * from get_totals_group_project('2022-12-01','2022-12-31')


drop function get_totals_group

CREATE OR REPLACE FUNCTION public.get_totals_group_project(start_date timestamp,end_date timestamp)
 RETURNS TABLE(project bigint, event_sub_type varchar,no_of_days NUMERIC)
 LANGUAGE plpgsql
AS $function$
begin
	 RETURN QUERY
select gt.project,gt.event_sub_type,sum(gt.no_of_days) from get_totals(start_date,end_date) gt group by gt.project ,gt.event_sub_type;
--select gt.project,gt.event_sub_type,sum(gt.no_of_days) from get_totals(start_date,end_date) gt group by gt.project ,gt.event_sub_type;
END; $function$
;


select * from get_totals_group_team('2022-12-01','2022-12-31')

drop function get_totals_team

CREATE OR REPLACE FUNCTION public.get_totals_group_team(start_date timestamp,end_date timestamp)
 RETURNS TABLE(project bigint, event_sub_type varchar,no_of_days NUMERIC)
 LANGUAGE plpgsql
AS $function$
begin
	 RETURN QUERY
select gt.team,gt.event_sub_type,sum(gt.no_of_days) from get_totals(start_date,end_date) gt group by gt.team ,gt.event_sub_type;
--select gt.project,gt.event_sub_type,sum(gt.no_of_days) from get_totals(start_date,end_date) gt group by gt.project ,gt.event_sub_type;
END; $function$
;