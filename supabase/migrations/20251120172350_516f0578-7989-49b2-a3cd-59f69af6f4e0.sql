-- First, delete any existing quiz data with old categories
DELETE FROM public.quiz_results;
DELETE FROM public.user_progress;

-- Update quiz category enum to use difficulty levels instead of React topics
ALTER TYPE public.quiz_category RENAME TO quiz_category_old;

CREATE TYPE public.quiz_category AS ENUM ('normal', 'medium', 'hard', 'mixed');

-- Update both tables to text first
ALTER TABLE public.quiz_results 
  ALTER COLUMN category TYPE text;

ALTER TABLE public.user_progress 
  ALTER COLUMN category TYPE text;

-- Now we can drop the old type
DROP TYPE public.quiz_category_old;

-- Convert both tables to the new enum type
ALTER TABLE public.quiz_results 
  ALTER COLUMN category TYPE public.quiz_category USING 'normal'::public.quiz_category;

ALTER TABLE public.user_progress 
  ALTER COLUMN category TYPE public.quiz_category USING 'normal'::public.quiz_category;

-- Add topic field to quiz_results and user_progress
ALTER TABLE public.quiz_results ADD COLUMN IF NOT EXISTS topic text;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS topic text;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Avatar images are publicly accessible'
  ) THEN
    CREATE POLICY "Avatar images are publicly accessible" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'avatars');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own avatar'
  ) THEN
    CREATE POLICY "Users can delete their own avatar" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;