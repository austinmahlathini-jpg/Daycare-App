CREATE FUNCTION enroll_child(p_classroom_id UUID, p_child_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_current_count INTEGER;
  v_capacity INTEGER;
BEGIN
  PERFORM id FROM classrooms WHERE id = p_classroom_id FOR UPDATE;
  SELECT capacity INTO v_capacity FROM classrooms WHERE id = p_classroom_id;
  SELECT COUNT(*) INTO v_current_count FROM enrollments WHERE classroom_id = p_classroom_id;

  IF v_current_count >= v_capacity THEN
    RAISE EXCEPTION 'This classroom is full';
  END IF;

  INSERT INTO enrollments (classroom_id, child_id) VALUES (p_classroom_id, p_child_id);

  RETURN 'Enrolled successfully';
END;
$$;
