CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  avatar TEXT,
  skills TEXT
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  platform_fee REAL NOT NULL,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL,
  buyer_id INTEGER NOT NULL,
  status TEXT DEFAULT 'requested', -- requested, confirmed, completed
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

-- Seed some initial data
INSERT OR IGNORE INTO users (id, name, email, password, avatar, skills) VALUES 
(1, 'Alice Johnson', 'alice@university.edu', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://i.pravatar.cc/150?u=alice', 'Python, Data Science'),
(2, 'Bob Smith', 'bob@university.edu', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://i.pravatar.cc/150?u=bob', 'UI/UX Design, Figma'),
(3, 'Charlie Brown', 'charlie@university.edu', '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy', 'https://i.pravatar.cc/150?u=charlie', 'Calculus, Physics');

INSERT OR IGNORE INTO services (id, seller_id, title, description, category, price, platform_fee) VALUES 
(1, 1, 'Python Tutoring', 'Learn Python from basics to advanced. Great for CS101 students.', 'Tutoring', 20.0, 2.0),
(2, 2, 'Resume Design', 'Get a professional resume design that stands out to recruiters.', 'Design', 15.0, 1.5),
(3, 3, 'Calculus II Help', 'Struggling with integration? I can help you ace your next exam.', 'Tutoring', 25.0, 2.5);
