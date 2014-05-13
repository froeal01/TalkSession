CREATE TABLE
	users_appointments_join
	(

		user_id BIGINT NOT NULL,
		appointment_id BIGINT NOT NULL,
		created_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
		PRIMARY KEY (user_id,appointment_id)
	);