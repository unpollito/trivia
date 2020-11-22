CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    password CHAR(60) NOT NULL,
    answered_question_count INT NOT NULL DEFAULT 0,
    correct_question_count INT NOT NULL DEFAULT 0
);

DO $$ BEGIN
    CREATE TYPE difficulty AS ENUM('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    question VARCHAR(120) NOT NULL,
    correct_answer VARCHAR(60) NOT NULL,
    incorrect_answer1 VARCHAR(60) NOT NULL,
    incorrect_answer2 VARCHAR(60) NOT NULL,
    incorrect_answer3 VARCHAR(60) NOT NULL,
    difficulty difficulty NOT NULL
);

CREATE INDEX ON question(difficulty);

CREATE TABLE IF NOT EXISTS user_question(
    user_id INT,
    question_id INT,
    last_answer_correct BOOLEAN,
    correct_answer_count INT,
    incorrect_answer_count INT,
    UNIQUE (user_id, question_id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_question
        FOREIGN KEY (question_id)
            REFERENCES question(id) ON DELETE CASCADE
);

CREATE INDEX ON user_question(last_answer_correct);
CREATE INDEX ON user_question(correct_answer_count);
CREATE INDEX ON user_question(incorrect_answer_count);
