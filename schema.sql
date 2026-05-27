-- ====================================================================
-- DISCIPLINEOS DATABASE SCHEMA (MySQL)
-- DESIGNED FOR STUDENT AND PLACEMENT PLACEMENT TRACKING ENGINE
-- ====================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS discipline_os_db;
USE discipline_os_db;

-- 1. users table
CREATE TABLE users (
    id VARCHAR(128) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_level INT DEFAULT 1,
    avatar_xp INT DEFAULT 0,
    avatar_title VARCHAR(100) DEFAULT 'Slacker Default',
    avatar_theme VARCHAR(50) DEFAULT 'neon-amber',
    discipline_score INT DEFAULT 50,
    streak INT DEFAULT 0,
    unlocked_tracks VARCHAR(512) DEFAULT '["cyberpunk-pulse"]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_active TIMESTAMP NULL
);

-- 2. tasks table (DSA trackers, aptitude, mock sessions)
CREATE TABLE tasks (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category ENUM('DSA', 'Aptitude', 'Resume', 'Mock_Interview', 'General') NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    xp_reward INT NOT NULL DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. focus_sessions table (distraction tracking focus sessions)
CREATE TABLE focus_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    duration_minutes INT NOT NULL,
    focus_exits INT DEFAULT 0,
    focus_score INT DEFAULT 100,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_focus_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. rewards table (Real pleasure marketplace rewards)
CREATE TABLE rewards (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category ENUM('Netflix', 'Gaming', 'Snacks', 'Social_Media', 'Custom') NOT NULL,
    cost_xp INT NOT NULL,
    redeemed_count INT DEFAULT 0,
    last_redeemed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rewards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. achievements table (Gamified medals tracker)
CREATE TABLE achievements (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(512) NOT NULL,
    badge VARCHAR(100) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_achievements_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. discipline_scores table (Historical daily consistency values)
CREATE TABLE discipline_scores (
    user_id VARCHAR(128) NOT NULL,
    date DATE NOT NULL,
    score INT NOT NULL DEFAULT 50,
    completed_tasks INT DEFAULT 0,
    missed_tasks INT DEFAULT 0,
    focus_minutes INT DEFAULT 0,
    focus_exits INT DEFAULT 0,
    PRIMARY KEY (user_id, date),
    CONSTRAINT fk_scores_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. analytics table (High intensity placement statistics indexes)
CREATE TABLE analytics (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    total_study_hours DECIMAL(10,2) DEFAULT 0.00,
    consistency_percentage INT DEFAULT 0,
    dsa_solved_count INT DEFAULT 0,
    aptitude_problems_count INT DEFAULT 0,
    resumes_tailored_count INT DEFAULT 0,
    mocks_completed_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_analytics_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. progress_tracking table (Tracks specific target completion tracks)
CREATE TABLE progress_tracking (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    track_name VARCHAR(100) NOT NULL, -- e.g. 'Dynamic Programming Master', 'Probability Core'
    milestone_percentage INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Creating Optimization database Indexes
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_focus_user_date ON focus_sessions(user_id, completed_at);
CREATE INDEX idx_scores_user_date ON daily_activities(user_id, date);
