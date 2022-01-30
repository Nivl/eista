BEGIN;

CREATE TABLE IF NOT EXISTS user_banking_items (
    plaid_item_id TEXT PRIMARY KEY CHECK (char_length(plaid_item_id) <= 100),
    user_id UUID NOT NULL REFERENCES users(id),
    plaid_access_token TEXT NOT NULL CHECK (char_length(plaid_access_token) <= 100),
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    deleted_at timestamptz
);

COMMIT;
