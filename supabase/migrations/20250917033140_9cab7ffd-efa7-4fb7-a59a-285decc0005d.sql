-- Ensure all RLS policies are in place

-- Check if RLS is enabled on all tables
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cie10_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create missing RLS policies if they don't exist
DO $$
BEGIN
    -- RLS Policies for clinical_notes
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clinical_notes' AND policyname = 'Users can view their own notes') THEN
        CREATE POLICY "Users can view their own notes" 
        ON public.clinical_notes 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clinical_notes' AND policyname = 'Users can create their own notes') THEN
        CREATE POLICY "Users can create their own notes" 
        ON public.clinical_notes 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- RLS Policies for chat_sessions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chat_sessions' AND policyname = 'Users can view their own chat sessions') THEN
        CREATE POLICY "Users can view their own chat sessions" 
        ON public.chat_sessions 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chat_sessions' AND policyname = 'Users can create their own chat sessions') THEN
        CREATE POLICY "Users can create their own chat sessions" 
        ON public.chat_sessions 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- RLS Policy for CIE-10 diagnoses (public read)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'cie10_diagnoses' AND policyname = 'Anyone can read CIE-10 diagnoses') THEN
        CREATE POLICY "Anyone can read CIE-10 diagnoses" 
        ON public.cie10_diagnoses 
        FOR SELECT 
        USING (true);
    END IF;
END $$;