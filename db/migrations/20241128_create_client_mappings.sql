-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Client_Mappings table
CREATE TABLE public."Client_Mappings" (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    tenant_id text NOT NULL,
    client_name text NOT NULL,
    created_at timestamp with time zone NULL DEFAULT current_timestamp,
    updated_at timestamp with time zone NULL DEFAULT current_timestamp,
    CONSTRAINT Client_Mappings_pkey PRIMARY KEY (id),
    CONSTRAINT Client_Mappings_tenant_id_key UNIQUE (tenant_id)
) TABLESPACE pg_default;

-- Create index for client_name
CREATE INDEX IF NOT EXISTS idx_client_mappings_client_name 
ON public."Client_Mappings" USING btree (client_name) 
TABLESPACE pg_default;

-- Create index for tenant_id
CREATE INDEX IF NOT EXISTS idx_client_mappings_tenant_id 
ON public."Client_Mappings" USING btree (tenant_id) 
TABLESPACE pg_default; 