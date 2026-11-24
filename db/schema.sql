-- Optional PostgreSQL schema for recording served requests; the application does not use it.
BEGIN;

CREATE TABLE IF NOT EXISTS request_events (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    received_at  timestamptz NOT NULL DEFAULT now(),
    method       text        NOT NULL CHECK (method IN ('GET', 'HEAD')),
    path         text        NOT NULL CHECK (char_length(path) BETWEEN 1 AND 2048),
    status_code  smallint    NOT NULL CHECK (status_code BETWEEN 100 AND 599),
    duration_ms  numeric(10, 3) NOT NULL CHECK (duration_ms >= 0)
);

CREATE INDEX IF NOT EXISTS request_events_received_at_idx ON request_events (received_at DESC);

COMMIT;
