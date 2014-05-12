CREATE sequence "appointment_id_seq" START WITH 1 increment BY 1 no maxvalue no minvalue cache 1 no cycle;

CREATE TABLE
	appointments
		(

			appointment_id BIGINT DEFAULT nextval('appointment_id_seq'::regclass) NOT NULL,
			appointment_date DATE NOT NULL,
			start_time TIME(6) WITHOUT TIME ZONE NOT NULL,
			end_time TIME(6) WITHOUT TIME ZONE NOT NULL,
			created_by BIGINT NOT NULL,
			client_name varchar(264),
			client_email varchar(264),
			confirmed BOOLEAN DEFAULT false, 
			booked BOOLEAN DEFAULT false,
			created_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
			modified_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
			PRIMARY KEY (appointment_id)

		);