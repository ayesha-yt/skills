/**
 * One-time database initialization script.
 * Run with: node db/init.js
 * This creates the tables and seeds initial data.
 */

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, 'skillbridge.db');

async function init() {
  const db = await open({ filename: dbPath, driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      avatar TEXT,
      skills TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      platform_fee REAL NOT NULL,
      status TEXT DEFAULT 'approved',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      status TEXT DEFAULT 'requested',
      total_amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (buyer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );
  `);

  // Seed initial users (passwords are bcrypt hash of "password123")
  await db.run(`
    INSERT OR IGNORE INTO users (id, name, email, password, avatar, skills) VALUES 
    (1, 'Zohaib', 'zohaib@skillbridge.pk', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 'Next.js, Node.js, PostgreSQL, Full-Stack Dev'),
    (2, 'Ayesha', 'ayesha@skillbridge.pk', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 'UI/UX Design, Figma, TailwindCSS, Wireframing'),
    (3, 'Abeeha', 'abeeha@skillbridge.pk', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', 'Calculus, Applied Physics, Logic & Algebra'),
    (4, 'Usman', 'usman@skillbridge.pk', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', 'Adobe Lightroom, DSLR Photography, Color Grading'),
    (5, 'Daniyal', 'daniyal@skillbridge.pk', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 'Pitch Decks, Business Strategy, Market Research'),
    (6, 'Aymen', 'aymen@skillbridge.pk', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'Meta Ads, Google SEO, Analytics, Branding'),
    (7, 'Eman', 'eman@skillbridge.pk', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', 'SEO Writing, Content Strategy, Copywriting')
  `);

  await db.run(`
    INSERT OR IGNORE INTO services (id, seller_id, title, description, category, price, platform_fee) VALUES 
    (1, 1, 'Full-Stack Web Development Tutoring', 'Need help with Next.js, Node.js, or SQL? I will guide you from core basics to deploying your production apps with clean databases.', 'Development', 3500.0, 350.0),
    (2, 2, 'Modern Mobile App UI/UX Design', 'Design premium layouts for your app. Includes interactive high-fidelity Figma prototypes, wireframes, and design guidelines.', 'Design', 4000.0, 400.0),
    (3, 3, 'Advanced Mathematics & Physics Support', 'Ace your Calculus-II, Linear Algebra, and Physics exams! Clear explanations, daily exercise walkthroughs, and step-by-step logic.', 'Tutoring', 2000.0, 200.0),
    (4, 4, 'Premium Product & Event Photography', 'High-quality professional DSLR photography and color-graded editing using Adobe Lightroom for local businesses or events.', 'Photography', 3000.0, 300.0),
    (5, 5, 'Startup Pitch Deck & Strategy Plan', 'Translate your vision into numbers. Creating highly-vetted financial forecasts, pitch decks, and targeted market strategies.', 'Business', 5000.0, 500.0),
    (6, 6, 'Meta Ads & Google SEO Optimization', 'Grow your reach and local sales! Comprehensive campaigns structure, keyword analysis, and search engine optimization planning.', 'Marketing', 2500.0, 250.0),
    (7, 7, 'Creative Copywriting & SEO Articles', 'Engaging, human-crafted SEO articles, social media captions, and landing page copies structured to convert visitors into buyers.', 'Marketing', 1800.0, 180.0)
  `);

  console.log('✅ Database initialized and seeded successfully!');
  await db.close();
}

init().catch(err => {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
});
