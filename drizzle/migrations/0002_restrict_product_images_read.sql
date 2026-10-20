DROP POLICY IF EXISTS "read product images" ON storage.objects;
CREATE POLICY "admin read product images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));