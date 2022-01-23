BEGIN;

ALTER TABLE users
    DROP COLUMN has_onboarded;

COMMIT;
