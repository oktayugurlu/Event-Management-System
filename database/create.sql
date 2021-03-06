DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
 

CREATE SEQUENCE public.corporate_user_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1; 
ALTER SEQUENCE public.corporate_user_seq
    OWNER TO postgres;
	
	 
CREATE SEQUENCE public.event_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1; 
ALTER SEQUENCE public.event_seq
    OWNER TO postgres;
	 

CREATE SEQUENCE public.question_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1; 
ALTER SEQUENCE public.question_seq
    OWNER TO postgres;
	 
CREATE SEQUENCE public.participant_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1; 
ALTER SEQUENCE public.participant_seq
    OWNER TO postgres;
	 

CREATE SEQUENCE public.answer_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1; 
ALTER SEQUENCE public.answer_seq
    OWNER TO postgres;
	
	--> survey sequences
CREATE SEQUENCE public.survey_question_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE public.survey_question_seq
    OWNER TO postgres;
	

CREATE SEQUENCE public.survey_answer_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE public.survey_answer_seq
    OWNER TO postgres;
	
	
CREATE SEQUENCE public.lots_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE public.lots_seq
    OWNER TO postgres;
	
CREATE SEQUENCE public.question_asked_by_participant_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE public.question_asked_by_participant_seq
    OWNER TO postgres;	
	
CREATE TABLE public.corporate_user
(
    "id" bigint NOT NULL default nextval('corporate_user_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,
    user_password character varying(255) COLLATE pg_catalog."default",
    username character varying(255) COLLATE pg_catalog."default",
    PRIMARY KEY ("id"),
    UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE public.corporate_user
    OWNER to postgres;
 

CREATE TABLE public.event
(
    "id" bigint NOT NULL default nextval('event_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,
    address character varying(255) COLLATE pg_catalog."default",
    end_date timestamp without time zone,
    latitude double precision,
    longitude double precision,
    notes character varying(255) COLLATE pg_catalog."default",
    quota bigint,
    start_date timestamp without time zone,
    title character varying(255) COLLATE pg_catalog."default",
    unique_name character varying(255) COLLATE pg_catalog."default",
    corporate_user_id bigint,
    PRIMARY KEY ("id"),
    UNIQUE (unique_name),
    FOREIGN KEY (corporate_user_id)
        REFERENCES public.corporate_user ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.event
    OWNER to postgres;

 

CREATE TABLE public.question
(
    "id" bigint NOT NULL  default nextval('question_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,
    question_content character varying(255) COLLATE pg_catalog."default",
    event_id bigint,
    PRIMARY KEY ("id"),
    UNIQUE (event_id, question_content),
    FOREIGN KEY (event_id)
        REFERENCES public."event" ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.question
    OWNER to postgres;

 

CREATE TABLE public.participant
(
    "id" bigint NOT NULL default nextval('participant_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,
    mail character varying(255) COLLATE pg_catalog."default",
    "name" character varying(255) COLLATE pg_catalog."default",
    phone_id character varying(255) COLLATE pg_catalog."default",
    ssn character varying(255) COLLATE pg_catalog."default",
    surname character varying(255) COLLATE pg_catalog."default",
    PRIMARY KEY ("id"),
    UNIQUE (ssn),
    UNIQUE (phone_id)
)

TABLESPACE pg_default;

ALTER TABLE public.participant
    OWNER to postgres;
 

CREATE TABLE public.application
(
    event_id bigint NOT NULL,
    participant_id bigint NOT NULL,
	creation_date timestamp without time zone,
    PRIMARY KEY (event_id, participant_id),
    FOREIGN KEY (event_id)
        REFERENCES public."event" ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (participant_id)
        REFERENCES public.participant ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.application
    OWNER to postgres;
 

CREATE TABLE public.answer
(
    "id" bigint NOT NULL default nextval('answer_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,
    "content" character varying(255) COLLATE pg_catalog."default",
    participant_id bigint,
    question_id bigint,
    PRIMARY KEY ("id"),
    UNIQUE (question_id, participant_id),
    FOREIGN KEY (participant_id)
        REFERENCES public.participant ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (question_id)
        REFERENCES public.question ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.answer
    OWNER to postgres;
	
	

 
CREATE TABLE public.survey_question
(
    "id" bigint NOT NULL default nextval('survey_question_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,
    "content" character varying(255) COLLATE pg_catalog."default",
    event_id bigint NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY (event_id)
        REFERENCES public.event ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.survey_answer
(
    "id" bigint NOT NULL default nextval('survey_answer_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,
    "point" int,
    survey_question_id bigint,
	participant_id bigint,
    PRIMARY KEY ("id"), 
    UNIQUE (participant_id, survey_question_id), 
    FOREIGN KEY (survey_question_id)
        REFERENCES public.survey_question ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    FOREIGN KEY (participant_id)
        REFERENCES public.participant ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

	
CREATE TABLE public.lots
(
    "id" bigint NOT NULL default nextval('lots_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,  
	gift_message character varying(255) COLLATE pg_catalog."default",
	participant_id bigint,
	event_id bigint,
    PRIMARY KEY ("id"),
    FOREIGN KEY (participant_id)
        REFERENCES public.participant ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (event_id)
        REFERENCES public.event ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE public.question_asked_by_participant
(
    "id" bigint NOT NULL default nextval('question_asked_by_participant_seq'),
    creation_date timestamp without time zone,
    last_modified_date timestamp without time zone,
    "version" bigint,  
	"content" character varying(255) COLLATE pg_catalog."default",
	participant_id bigint,
	event_id bigint,
    PRIMARY KEY ("id"),
    FOREIGN KEY (participant_id)
        REFERENCES public.participant ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (event_id)
        REFERENCES public.event ("id") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);