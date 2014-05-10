CREATE sequence "user_id_seq" START WITH 1 increment BY 1 no maxvalue no minvalue cache 1 no cycle;

CREATE TABLE
		users
		(
			user_id BIGINT DEFAULT nextval('user_id_seq'::regclass) NOT NULL,
			email varchar CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$') NOT NULL,
			password varchar NOT NULL,
			created_at TIMESTAMP(6) WITHOUT TIME ZONE,
			modified_at TIMESTAMP(6) WITHOUT TIME ZONE,
			PRIMARY KEY (user_id)
		);