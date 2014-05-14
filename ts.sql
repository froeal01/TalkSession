--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


SET search_path = public, pg_catalog;

--
-- Name: appointment_id_seq; Type: SEQUENCE; Schema: public; Owner: talksession
--

CREATE SEQUENCE appointment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.appointment_id_seq OWNER TO talksession;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: talksession; Tablespace: 
--

CREATE TABLE appointments (
    appointment_id bigint DEFAULT nextval('appointment_id_seq'::regclass) NOT NULL,
    appointment_date date NOT NULL,
    start_time time(6) without time zone NOT NULL,
    end_time time(6) without time zone NOT NULL,
    created_by bigint NOT NULL,
    client_name character varying(264),
    client_email character varying(264),
    confirmed boolean DEFAULT false,
    booked boolean DEFAULT false,
    created_at timestamp(6) without time zone NOT NULL,
    modified_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.appointments OWNER TO talksession;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: talksession
--

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO talksession;

--
-- Name: users; Type: TABLE; Schema: public; Owner: talksession; Tablespace: 
--

CREATE TABLE users (
    user_id bigint DEFAULT nextval('user_id_seq'::regclass) NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    created_at timestamp(6) without time zone,
    modified_at timestamp(6) without time zone,
    admin boolean DEFAULT false,
    first_name character varying(264),
    CONSTRAINT proper_email CHECK (((email)::text ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text))
);


ALTER TABLE public.users OWNER TO talksession;

--
-- Name: users_appointments_join; Type: TABLE; Schema: public; Owner: talksession; Tablespace: 
--

CREATE TABLE users_appointments_join (
    user_id bigint NOT NULL,
    appointment_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.users_appointments_join OWNER TO talksession;

--
-- Name: appointment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: talksession
--

SELECT pg_catalog.setval('appointment_id_seq', 16, true);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: talksession
--

COPY appointments (appointment_id, appointment_date, start_time, end_time, created_by, client_name, client_email, confirmed, booked, created_at, modified_at) FROM stdin;
4	2014-05-20	14:00:00	14:45:00	1	\N	\N	f	f	46331-10-18 03:47:26.000128	46331-10-18 03:47:26.000128
5	2014-05-15	13:00:00	13:45:00	1	\N	\N	f	f	46331-10-29 15:40:16.999936	46331-10-29 15:40:16.999936
10	2014-05-24	16:00:00	16:45:00	1	\N	\N	f	f	46331-11-17 05:57:34.000128	46331-11-17 05:57:34.000128
11	2014-05-12	14:00:00	14:45:00	1	\N	\N	f	f	2014-05-12 00:00:00	2014-05-12 00:00:00
15	2014-05-13	15:00:00	15:45:00	1	\N	\N	f	f	46333-12-06 03:39:16.999936	46333-12-06 03:39:16.999936
12	2014-05-13	11:00:00	11:45:00	1	mr.client	client@email.com	f	t	46333-12-06 03:39:16	46333-12-06 03:39:16
16	2014-05-13	16:00:00	16:45:00	1	mr.client	client@email.com	f	t	46333-12-06 03:39:16.999936	46333-12-06 03:39:16.999936
13	2014-05-13	13:00:00	13:45:00	1	mr.client	client@email.com	f	t	46333-12-06 03:39:16.999936	46333-12-06 03:39:16.999936
6	2014-05-14	13:00:00	13:45:00	1	mr.client	client@email.com	t	t	46331-10-30 00:09:27.000064	46331-10-30 00:09:27.000064
14	2014-05-13	14:00:00	14:45:00	1	mr.client	client@email.com	t	t	46333-12-06 03:39:16.999936	46333-12-06 03:39:16.999936
7	2014-05-23	13:00:00	13:45:00	1	mrs.client	mrs.client@email.com	t	t	46331-11-13 20:03:35.000064	46331-11-13 20:03:35.000064
9	2014-05-26	16:00:00	16:45:00	1	mrs.client	mrs.client@email.com	t	t	46331-11-16 00:46:49.999872	46331-11-16 00:46:49.999872
1	2014-05-19	15:00:00	15:45:00	1	mr.client	client@email.com	t	t	2014-05-12 00:00:00	2014-05-12 00:00:00
8	2014-05-30	15:00:00	15:45:00	1	mr.client	client@email.com	t	t	46331-11-14 19:55:28.999936	46331-11-14 19:55:28.999936
\.


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: talksession
--

SELECT pg_catalog.setval('user_id_seq', 2, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: talksession
--

COPY users (user_id, email, password, created_at, modified_at, admin, first_name) FROM stdin;
1	test@test.com	password	2014-05-10 00:00:00	2014-05-10 00:00:00	t	\N
2	client@email.com	password	2014-05-13 00:00:00	2014-05-13 00:00:00	f	mr.client
\.


--
-- Data for Name: users_appointments_join; Type: TABLE DATA; Schema: public; Owner: talksession
--

COPY users_appointments_join (user_id, appointment_id, created_at) FROM stdin;
2	6	2014-05-14 00:00:00
\.


--
-- Name: appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: talksession; Tablespace: 
--

ALTER TABLE ONLY appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id);


--
-- Name: users_appointments_join_pkey; Type: CONSTRAINT; Schema: public; Owner: talksession; Tablespace: 
--

ALTER TABLE ONLY users_appointments_join
    ADD CONSTRAINT users_appointments_join_pkey PRIMARY KEY (user_id, appointment_id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: talksession; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: alexfroelich
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM alexfroelich;
GRANT ALL ON SCHEMA public TO alexfroelich;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

