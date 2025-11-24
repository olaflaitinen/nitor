-- Development Seed Data for NITOR
-- Run this script to populate the database with sample data for development/testing
-- WARNING: This will delete existing data!

-- Clean up existing data (in correct order due to foreign keys)
TRUNCATE TABLE comment_likes CASCADE;
TRUNCATE TABLE mentions CASCADE;
TRUNCATE TABLE endorsements CASCADE;
TRUNCATE TABLE bookmarks CASCADE;
TRUNCATE TABLE reposts CASCADE;
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE content_tags CASCADE;
TRUNCATE TABLE tags CASCADE;
TRUNCATE TABLE content CASCADE;
TRUNCATE TABLE follows CASCADE;
TRUNCATE TABLE connections CASCADE;
TRUNCATE TABLE blocked_users CASCADE;
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE skills CASCADE;
TRUNCATE TABLE awards CASCADE;
TRUNCATE TABLE publications CASCADE;
TRUNCATE TABLE cv_experiences CASCADE;
TRUNCATE TABLE cv_projects CASCADE;
TRUNCATE TABLE user_settings CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE profiles CASCADE;
TRUNCATE TABLE refresh_tokens CASCADE;
TRUNCATE TABLE two_factor_auth CASCADE;
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE users CASCADE;

-- Insert sample users
-- Password for all users: "password123" (hashed with BCrypt)
INSERT INTO users (id, email, password_hash, email_verified, is_active, created_at, updated_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'john.doe@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, true, NOW(), NOW()),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'jane.smith@research.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, true, NOW(), NOW()),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'alice.johnson@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, true, NOW(), NOW()),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'bob.williams@institute.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, true, NOW(), NOW()),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'carol.martinez@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, true, NOW(), NOW());

-- Insert sample profiles
INSERT INTO profiles (id, full_name, handle, academic_title, discipline, institution, bio, nitor_score, verified, onboarding_complete, followers_count, following_count, publications_count, profile_visibility, created_at, updated_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dr. John Doe', 'johndoe', 'Professor', 'Computer Science', 'MIT', 'Passionate researcher in AI and Machine Learning. Published author of 50+ papers.', 850.5, true, true, 0, 0, 12, 'PUBLIC', NOW(), NOW()),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Dr. Jane Smith', 'janesmith', 'Associate Professor', 'Artificial Intelligence', 'Stanford University', 'Focusing on deep learning and neural networks.', 720.3, true, true, 0, 0, 8, 'PUBLIC', NOW(), NOW()),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Dr. Alice Johnson', 'alicejohnson', 'Professor', 'Quantum Physics', 'Harvard University', 'Quantum computing and entanglement researcher.', 920.7, true, true, 0, 0, 15, 'PUBLIC', NOW(), NOW()),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Dr. Bob Williams', 'bobwilliams', 'Senior Researcher', 'Neuroscience', 'Oxford University', 'Cognitive neuroscience and brain mapping.', 680.2, false, true, 0, 0, 6, 'PUBLIC', NOW(), NOW()),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Dr. Carol Martinez', 'carolmartinez', 'Professor', 'Genetics', 'Cambridge University', 'CRISPR and gene editing specialist.', 790.8, true, true, 0, 0, 10, 'PUBLIC', NOW(), NOW());

-- Insert sample connections
INSERT INTO connections (id, user_id, connected_user_id, status, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ACCEPTED', NOW(), NOW()),
(gen_random_uuid(), 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ACCEPTED', NOW(), NOW()),
(gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'ACCEPTED', NOW(), NOW()),
(gen_random_uuid(), 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ACCEPTED', NOW(), NOW());

-- Insert sample follows
INSERT INTO follows (id, follower_id, following_id, created_at) VALUES
(gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', NOW()),
(gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NOW()),
(gen_random_uuid(), 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW()),
(gen_random_uuid(), 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW()),
(gen_random_uuid(), 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW());

-- Insert sample content
INSERT INTO content (id, author_id, body, content_type, visibility, endorsements_count, comments_count, reposts_count, created_at, updated_at) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Excited to announce our latest AI research breakthrough! Our team has developed a new neural network architecture that achieves state-of-the-art performance. #AI #Research #MachineLearning', 'POST', 'PUBLIC', 0, 0, 0, NOW(), NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Just published our paper on deep learning optimization techniques in Nature. Grateful for the amazing collaboration! #DeepLearning #Publication', 'POST', 'PUBLIC', 0, 0, 0, NOW(), NOW()),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Fascinating results from our quantum entanglement experiments. The implications for quantum computing are profound. #QuantumPhysics #Science', 'POST', 'PUBLIC', 0, 0, 0, NOW(), NOW()),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'New insights into brain plasticity from our latest neuroscience study. #Neuroscience #BrainResearch', 'POST', 'PUBLIC', 0, 0, 0, NOW(), NOW()),
('f4eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'CRISPR breakthrough! We have successfully edited genes with unprecedented precision. #Genetics #CRISPR #Biotech', 'POST', 'PUBLIC', 0, 0, 0, NOW(), NOW());

-- Insert sample comments
INSERT INTO comments (id, content_id, author_id, body, likes_count, created_at, updated_at) VALUES
(gen_random_uuid(), 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Incredible work! This will change the field.', 0, NOW(), NOW()),
(gen_random_uuid(), 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Looking forward to reading the full paper!', 0, NOW(), NOW()),
(gen_random_uuid(), 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Congratulations on the publication!', 0, NOW(), NOW()),
(gen_random_uuid(), 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'This aligns perfectly with our research.', 0, NOW(), NOW());

-- Insert sample endorsements
INSERT INTO endorsements (id, user_id, content_id, created_at) VALUES
(gen_random_uuid(), 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', NOW()),
(gen_random_uuid(), 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', NOW()),
(gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', NOW()),
(gen_random_uuid(), 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', NOW());

-- Insert sample tags
INSERT INTO tags (id, name, usage_count, created_at) VALUES
(gen_random_uuid(), 'AI', 1, NOW()),
(gen_random_uuid(), 'Research', 2, NOW()),
(gen_random_uuid(), 'MachineLearning', 1, NOW()),
(gen_random_uuid(), 'DeepLearning', 1, NOW()),
(gen_random_uuid(), 'QuantumPhysics', 1, NOW()),
(gen_random_uuid(), 'Neuroscience', 1, NOW()),
(gen_random_uuid(), 'CRISPR', 1, NOW());

-- Insert sample user settings
INSERT INTO user_settings (id, user_id, email_notifications, push_notifications, newsletter, profile_visibility, show_email, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true, true, true, 'PUBLIC', false, NOW(), NOW()),
(gen_random_uuid(), 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', true, true, false, 'PUBLIC', false, NOW(), NOW()),
(gen_random_uuid(), 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', true, false, true, 'PUBLIC', false, NOW(), NOW()),
(gen_random_uuid(), 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', false, true, false, 'CONNECTIONS_ONLY', false, NOW(), NOW()),
(gen_random_uuid(), 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', true, true, true, 'PUBLIC', true, NOW(), NOW());

-- Success message
SELECT 'Seed data inserted successfully!' as message;
