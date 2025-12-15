-- Create candidatures table to store application submissions
CREATE TABLE public.candidatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  age TEXT NOT NULL,
  programme TEXT NOT NULL,
  experience TEXT NOT NULL,
  objectifs TEXT NOT NULL,
  parcours TEXT NOT NULL,
  disponibilites TEXT NOT NULL,
  motivation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.candidatures ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a candidature (public form)
CREATE POLICY "Anyone can submit a candidature"
ON public.candidatures
FOR INSERT
WITH CHECK (true);

-- Only admins can view candidatures (will be implemented with proper auth later)
-- For now, we need a way for the app to read back the inserted row
CREATE POLICY "Service role can view all candidatures"
ON public.candidatures
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_candidatures_updated_at
BEFORE UPDATE ON public.candidatures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();