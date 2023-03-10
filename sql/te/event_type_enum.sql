
CREATE TYPE public."event_type" AS ENUM (
	'planning',
	'overtime',
	'travel',
	'te',
	'dw',
	'ste');


    ALTER TYPE public."event_type" ADD VALUE 'test4' AFTER 'ste';

    drop type public."event_type"