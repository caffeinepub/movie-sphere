# Specification

## Summary
**Goal:** Lock Movie Sphere admin access to a single permanent site owner and add an admin-only in-app movie video file upload that can be played from the movie details page.

**Planned changes:**
- Implement a secure admin bootstrap flow where the first authenticated principal can claim admin only once, and the admin cannot be overwritten afterward.
- Ensure all admin-only backend methods (including movie create/update/delete and new upload APIs) strictly reject non-admin callers.
- Add backend storage and APIs to upload and retrieve a per-movie video file (bytes) stored in-canister, guarded by admin access.
- Update the admin movie create/edit UI to include an admin-only video file attachment input for uploading/replacing a movie’s video file.
- Update MovieDetailPage to play an uploaded in-canister video file when present, while keeping existing URL-based playback working for movies that use a video URL.

**User-visible outcome:** The site owner can securely become the one permanent admin, upload a movie video file directly in the admin UI, and users can play the uploaded video from the movie detail page without needing an external video URL (while existing URL playback still works).
