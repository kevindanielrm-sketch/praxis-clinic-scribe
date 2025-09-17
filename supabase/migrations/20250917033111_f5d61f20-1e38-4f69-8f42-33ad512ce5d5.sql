-- Create clinical_notes table
CREATE TABLE public.clinical_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  transcription TEXT NOT NULL,
  structured_note TEXT, -- SOAP format or other structured format
  audio_duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on clinical_notes
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;

-- Create cie10_diagnoses table for ICD-10 codes
CREATE TABLE public.cie10_diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- ICD-10 code (e.g., "A01.0")
  description TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create note_diagnoses junction table
CREATE TABLE public.note_diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES public.clinical_notes(id) ON DELETE CASCADE,
  diagnosis_code TEXT NOT NULL REFERENCES public.cie10_diagnoses(code) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(note_id, diagnosis_code)
);

-- Enable RLS on note_diagnoses
ALTER TABLE public.note_diagnoses ENABLE ROW LEVEL SECURITY;

-- Create chat_sessions table for managing conversation history
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nueva sesión',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Add missing columns to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medical_license TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS institution TEXT;

-- RLS Policies for clinical_notes
CREATE POLICY "Users can view their own notes" 
ON public.clinical_notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
ON public.clinical_notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.clinical_notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.clinical_notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for note_diagnoses
CREATE POLICY "Users can view diagnoses of their own notes" 
ON public.note_diagnoses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.clinical_notes 
    WHERE clinical_notes.id = note_diagnoses.note_id 
    AND clinical_notes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create diagnoses for their own notes" 
ON public.note_diagnoses 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clinical_notes 
    WHERE clinical_notes.id = note_diagnoses.note_id 
    AND clinical_notes.user_id = auth.uid()
  )
);

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" 
ON public.chat_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Public read access for CIE-10 diagnoses (reference data)
CREATE POLICY "Anyone can read CIE-10 diagnoses" 
ON public.cie10_diagnoses 
FOR SELECT 
USING (true);

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_clinical_notes_updated_at
  BEFORE UPDATE ON public.clinical_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some common CIE-10 codes for testing
INSERT INTO public.cie10_diagnoses (code, description, category) VALUES
  ('Z00.0', 'Examen médico general', 'Factores que influyen en el estado de salud'),
  ('K59.0', 'Estreñimiento', 'Enfermedades del sistema digestivo'),
  ('I10', 'Hipertensión esencial', 'Enfermedades del sistema circulatorio'),
  ('E11.9', 'Diabetes mellitus tipo 2 sin complicaciones', 'Enfermedades endocrinas'),
  ('J06.9', 'Infección aguda de las vías respiratorias superiores', 'Enfermedades del sistema respiratorio'),
  ('M54.5', 'Dolor lumbar', 'Enfermedades del sistema musculoesquelético'),
  ('R50.9', 'Fiebre no especificada', 'Síntomas y signos'),
  ('Z51.1', 'Quimioterapia para neoplasia', 'Factores que influyen en el estado de salud');