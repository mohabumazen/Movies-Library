DROP TABLE IF EXISTS moviesdata;

CREATE TABLE IF NOT EXISTS moviesdata (
    id SERIAL PRIMARY KEY,
    title varchar(255),
    length varchar(255),
    summary varchar(255),
    genres varchar(255),
    comment varchar(255)

)