
CREATE TYPE public."event_type" AS ENUM (
	'planning',
	'overtime',
	'travel',
	'te',
	'dw',
	'ste');


    drop type public."event_type"


	CREATE TYPE approval_status AS ENUM (
	'Planned',
	'Approved',
	'Rejected');