-- Nitor Database Schema - Initial Migration
-- Version: 1.0.0
-- Description: Create core tables for authentication, profiles, and basic functionality

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expiry TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_token_expiry TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_password_token);

-- ============================================================================
-- PROFILES
-- ============================================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    handle VARCHAR(50) UNIQUE NOT NULL,
    institution VARCHAR(255),
    academic_title VARCHAR(100),
    avatar_url TEXT,
    bio TEXT CHECK (LENGTH(bio) <= 500),
    orcid VARCHAR(19),
    discipline VARCHAR(100),
    nitor_score DECIMAL(5,2) DEFAULT 0.0,
    verified BOOLEAN DEFAULT FALSE,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    publications_count INT DEFAULT 0,
    profile_visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (profile_visibility IN ('PUBLIC', 'PRIVATE', 'FOLLOWERS_ONLY')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_handle ON profiles(handle);
CREATE INDEX idx_profiles_institution ON profiles(institution);
CREATE INDEX idx_profiles_nitor_score ON profiles(nitor_score DESC);
CREATE INDEX idx_profiles_verified ON profiles(verified);

-- ============================================================================
-- CONTENT (Posts & Articles)
-- ============================================================================

CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('POST', 'ARTICLE')),
    body TEXT NOT NULL,
    title VARCHAR(500),
    abstract TEXT,
    keywords TEXT[],
    likes_count INT DEFAULT 0,
    reposts_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    pinned BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_author ON content(author_id);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_created ON content(created_at DESC);
CREATE INDEX idx_content_pinned ON content(pinned);
CREATE INDEX idx_content_keywords ON content USING GIN(keywords);

-- ============================================================================
-- COMMENTS
-- ============================================================================

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_content ON comments(content_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- ============================================================================
-- ENDORSEMENTS (Likes)
-- ============================================================================

CREATE TABLE endorsements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

CREATE INDEX idx_endorsements_user ON endorsements(user_id);
CREATE INDEX idx_endorsements_content ON endorsements(content_id);

-- ============================================================================
-- COMMENT LIKES
-- ============================================================================

CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, comment_id)
);

CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);
CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);

-- ============================================================================
-- REPOSTS
-- ============================================================================

CREATE TABLE reposts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

CREATE INDEX idx_reposts_user ON reposts(user_id);
CREATE INDEX idx_reposts_content ON reposts(content_id);
CREATE INDEX idx_reposts_created ON reposts(created_at DESC);

-- ============================================================================
-- BOOKMARKS
-- ============================================================================

CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_content ON bookmarks(content_id);

-- ============================================================================
-- FOLLOWS
-- ============================================================================

CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CITATION', 'FOLLOW', 'REPLY', 'ENDORSE', 'MENTION', 'REPOST')),
    target_id UUID,
    target_type VARCHAR(50),
    target_preview TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- TRIGGERS FOR updated_at TIMESTAMP
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGERS FOR COUNTING
-- ============================================================================

-- Update followers count
CREATE OR REPLACE FUNCTION update_followers_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
        UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
        UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER follow_count_trigger AFTER INSERT OR DELETE ON follows
    FOR EACH ROW EXECUTE FUNCTION update_followers_count();

-- Update likes count on content
CREATE OR REPLACE FUNCTION update_content_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE content SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE content SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.content_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER endorsement_count_trigger AFTER INSERT OR DELETE ON endorsements
    FOR EACH ROW EXECUTE FUNCTION update_content_likes_count();

-- Update comments count
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE content SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE content SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.content_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_count_trigger AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- Update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE comments SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.comment_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_like_count_trigger AFTER INSERT OR DELETE ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Update reposts count
CREATE OR REPLACE FUNCTION update_reposts_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE content SET reposts_count = reposts_count + 1 WHERE id = NEW.content_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE content SET reposts_count = GREATEST(0, reposts_count - 1) WHERE id = OLD.content_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER repost_count_trigger AFTER INSERT OR DELETE ON reposts
    FOR EACH ROW EXECUTE FUNCTION update_reposts_count();
