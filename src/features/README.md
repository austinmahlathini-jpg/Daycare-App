# Features
Vertical Slice folders. Currently: enrollment/ (repository.ts wraps
getClassrooms, getChildren, getEnrollmentCounts, enrollChild — the last
one calls the enroll_child Postgres function via rpc()).
