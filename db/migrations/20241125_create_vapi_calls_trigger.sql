DECLARE
    total_message_length INTEGER;
    combined_messages TEXT;
BEGIN
    -- Initial debug log
    RAISE NOTICE 'Trigger function started for call_id: %', NEW.id;
    RAISE NOTICE 'Messages content: %', NEW.messages;

    -- Combine all messages into a single text for analysis
    SELECT string_agg(
        CASE 
            WHEN msg->>'role' = 'customer' THEN 
                format('Customer: %s', msg->>'message')
            ELSE 
                format('Assistant: %s', msg->>'message')
        END,
        E'\n'
    )
    INTO combined_messages
    FROM jsonb_array_elements(NEW.messages) AS msg;

    -- Debug log after combining messages
    RAISE NOTICE 'Combined messages: %', combined_messages;

    -- Calculate total length
    total_message_length := length(combined_messages);
    RAISE NOTICE 'Total message length: %', total_message_length;

    -- If messages exceed 1000 characters, create review entry
    IF total_message_length > 1000 THEN
        RAISE NOTICE 'Length exceeds 1000, creating review entry';
        
        INSERT INTO public.transcripts_for_review (
            vapi_call_id,
            transcript,
            transcript_metadata,
            user_id,
            frontegg_id,
            client_id,
            tenant_id,
            session_id,
            assignment_id,
            pl_group_id,  -- This needs to be an integer
            schedule_id,
            activity_type,
            experience_type
        ) VALUES (
            NEW.id,
            combined_messages,
            jsonb_build_object(
                'message_count', jsonb_array_length(NEW.messages),
                'total_length', total_message_length
            ),
            NEW.user_id,
            NEW.frontegg_id,
            NEW.client_id,
            NEW.tenant_id,
            NEW.session_id,
            NEW.assignment_id,
            (NEW.pl_group_id)::integer,  -- Cast to integer
            NEW.schedule_id,
            NEW.activity_type,
            NEW.experience_type,
            NEW.vapi_call_id
        );
        
        RAISE NOTICE 'Review entry created successfully';
    ELSE
        RAISE NOTICE 'Message length (%) does not exceed 1000 characters', total_message_length;
    END IF;

    RETURN NEW;
END;