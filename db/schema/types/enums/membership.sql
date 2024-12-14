CREATE TYPE public.membership AS ENUM (
    'free',
    'pro'
);

COMMENT ON TYPE public.membership IS 'User membership level'; 