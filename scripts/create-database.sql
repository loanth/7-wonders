-- Script de création de la base de données pour le jeu d'énigmes

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des parties
CREATE TABLE IF NOT EXISTS partie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    m1 BOOLEAN DEFAULT FALSE,
    m2 BOOLEAN DEFAULT FALSE,
    m3 BOOLEAN DEFAULT FALSE,
    m4 BOOLEAN DEFAULT FALSE,
    m5 BOOLEAN DEFAULT FALSE,
    m6 BOOLEAN DEFAULT FALSE,
    m7 BOOLEAN DEFAULT FALSE,
    public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison user_partie
CREATE TABLE IF NOT EXISTS user_partie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    partie_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (partie_id) REFERENCES partie(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_partie (user_id, partie_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_user_pseudo ON user(pseudo);
CREATE INDEX idx_partie_public ON partie(public);
CREATE INDEX idx_user_partie_user ON user_partie(user_id);
CREATE INDEX idx_user_partie_partie ON user_partie(partie_id);
