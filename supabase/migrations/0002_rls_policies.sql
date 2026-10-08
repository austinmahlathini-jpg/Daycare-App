CREATE POLICY "staff full access"
ON classrooms
FOR ALL
TO authenticated
USING (true);

CREATE POLICY "staff full access"
ON enrollments
FOR ALL
TO authenticated
USING (true);

CREATE POLICY "staff full access"
ON children
FOR ALL
TO authenticated
USING (true);
