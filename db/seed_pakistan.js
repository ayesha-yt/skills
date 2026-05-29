const getDb = require('./index');

async function seed() {
  try {
    const db = await getDb();
    console.log('Connected to database for seeding...');

    // Clear existing services, bookings, and users to avoid constraint violations or duplicate emails
    console.log('Cleaning existing tables...');
    await db.run('DELETE FROM ratings').catch(() => {});
    await db.run('DELETE FROM bookings').catch(() => {});
    await db.run('DELETE FROM services').catch(() => {});
    await db.run('DELETE FROM users').catch(() => {});

    // Sync sequences with maximum IDs if PG to avoid duplicate key errors on subsequent inserts/signups
    if (db.isPostgres) {
      await db.run("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))").catch(() => {});
      await db.run("SELECT setval('services_id_seq', (SELECT MAX(id) FROM services))").catch(() => {});
      await db.run("SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings))").catch(() => {});
      await db.run("SELECT setval('ratings_id_seq', (SELECT MAX(id) FROM ratings))").catch(() => {});
    }

    console.log('Seeding localized Pakistani users...');
    // Seed Users (passwords are bcrypt hash of "password123")
    const users = [
      {
        id: 1,
        name: 'Zohaib',
        email: 'zohaib@skillbridge.pk',
        password: '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        skills: 'Next.js, Node.js, PostgreSQL, Full-Stack Dev',
        role: 'user'
      },
      {
        id: 2,
        name: 'Ayesha',
        email: 'ayesha@skillbridge.pk',
        password: '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        skills: 'UI/UX Design, Figma, TailwindCSS, Wireframing',
        role: 'user'
      },
      {
        id: 3,
        name: 'Abeeha',
        email: 'abeeha@skillbridge.pk',
        password: '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
        skills: 'Calculus, Applied Physics, Logic & Algebra',
        role: 'user'
      },
      {
        id: 4,
        name: 'Usman',
        email: 'usman@skillbridge.pk',
        password: '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        skills: 'Adobe Lightroom, DSLR Photography, Color Grading',
        role: 'user'
      },
      {
        id: 5,
        name: 'Daniyal',
        email: 'daniyal@skillbridge.pk',
        password: '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        skills: 'Pitch Decks, Business Strategy, Market Research',
        role: 'user'
      },
      {
        id: 6,
        name: 'Aymen',
        email: 'aymen@skillbridge.pk',
        password: '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        skills: 'Meta Ads, Google SEO, Analytics, Branding',
        role: 'user'
      },
      {
        id: 7,
        name: 'Eman',
        email: 'eman@skillbridge.pk',
        password: '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        skills: 'SEO Writing, Content Strategy, Copywriting',
        role: 'user'
      },
      {
        id: 8,
        name: 'Admin SkillBridge',
        email: 'admin@skillbridge.pk',
        password: '$2b$10$/ecfT8zOxj78yDmOnzhpB.0JkXfEJvezEIvrdT8pNCCLbPJGjbSPy',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        skills: 'System Administration, Operations Management',
        role: 'admin'
      }
    ];

    for (const u of users) {
      if (db.isPostgres) {
        await db.run(
          `INSERT INTO users (id, name, email, password, avatar, skills, role) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [u.id, u.name, u.email, u.password, u.avatar, u.skills, u.role]
        );
      } else {
        await db.run(
          `INSERT INTO users (id, name, email, password, avatar, skills, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [u.id, u.name, u.email, u.password, u.avatar, u.skills, u.role]
        );
      }
    }
    console.log('Seeded Users successfully.');

    console.log('Seeding localized Pakistani services...');
    const services = [
      {
        id: 1,
        seller_id: 1,
        title: 'Full-Stack Web Development Tutoring',
        description: 'Need help with Next.js, Node.js, or SQL? I will guide you from core basics to deploying your production apps with clean databases.',
        category: 'Development',
        price: 3500,
        platform_fee: 350
      },
      {
        id: 2,
        seller_id: 2,
        title: 'Modern Mobile App UI/UX Design',
        description: 'Design premium layouts for your app. Includes interactive high-fidelity Figma prototypes, custom wireframes, and design guidelines.',
        category: 'Design',
        price: 4000,
        platform_fee: 400
      },
      {
        id: 3,
        seller_id: 3,
        title: 'Advanced Mathematics & Physics Support',
        description: 'Ace your Calculus-II, Linear Algebra, and Physics exams! Clear explanations, daily exercise walkthroughs, and step-by-step logic.',
        category: 'Tutoring',
        price: 2000,
        platform_fee: 200
      },
      {
        id: 4,
        seller_id: 4,
        title: 'Premium Product & Event Photography',
        description: 'High-quality professional DSLR photography and color-graded editing using Adobe Lightroom for local businesses, portfolios, or events.',
        category: 'Photography',
        price: 3000,
        platform_fee: 300
      },
      {
        id: 5,
        seller_id: 5,
        title: 'Startup Pitch Deck & Strategy Plan',
        description: 'Translate your vision into numbers. Creating highly-vetted financial forecasts, pitch decks, and targeted market strategies.',
        category: 'Business',
        price: 5000,
        platform_fee: 500
      },
      {
        id: 6,
        seller_id: 6,
        title: 'Meta Ads & Google SEO Optimization',
        description: 'Grow your reach and local sales! Comprehensive campaigns structure, keyword analysis, and search engine optimization planning.',
        category: 'Marketing',
        price: 2500,
        platform_fee: 250
      },
      {
        id: 7,
        seller_id: 7,
        title: 'Creative Copywriting & SEO Articles',
        description: 'Engaging, human-crafted SEO articles, social media captions, and landing page copies structured to convert visitors into buyers.',
        category: 'Marketing',
        price: 1800,
        platform_fee: 180
      }
    ];

    for (const s of services) {
      if (db.isPostgres) {
        await db.run(
          `INSERT INTO services (id, seller_id, title, description, category, price, platform_fee, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [s.id, s.seller_id, s.title, s.description, s.category, s.price, s.platform_fee, 'approved']
        );
      } else {
        await db.run(
          `INSERT INTO services (id, seller_id, title, description, category, price, platform_fee, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [s.id, s.seller_id, s.title, s.description, s.category, s.price, s.platform_fee, 'approved']
        );
      }
    }
    console.log('Seeded Services successfully.');

    // Seed a couple of default ratings for reviews
    console.log('Seeding reviews...');
    const bookings = [
      { id: 1, service_id: 1, buyer_id: 2, total_amount: 3500 },
      { id: 2, service_id: 2, buyer_id: 3, total_amount: 4000 }
    ];

    for (const b of bookings) {
      if (db.isPostgres) {
        await db.run(
          `INSERT INTO bookings (id, service_id, buyer_id, total_amount, status) VALUES ($1, $2, $3, $4, $5)`,
          [b.id, b.service_id, b.buyer_id, b.total_amount, 'completed']
        );
      } else {
        await db.run(
          `INSERT INTO bookings (id, service_id, buyer_id, total_amount, status) VALUES (?, ?, ?, ?, ?)`,
          [b.id, b.service_id, b.buyer_id, b.total_amount, 'completed']
        );
      }
    }

    const ratings = [
      { id: 1, booking_id: 1, rating: 5, comment: 'Zohaib is absolute wizard! Solved my database bug in less than 30 minutes.' },
      { id: 2, booking_id: 2, rating: 5, comment: 'Ayesha design is amazing. Premium work, great communication, and fast turnaround.' }
    ];

    for (const r of ratings) {
      if (db.isPostgres) {
        await db.run(
          `INSERT INTO ratings (id, booking_id, rating, comment) VALUES ($1, $2, $3, $4)`,
          [r.id, r.booking_id, r.rating, r.comment]
        );
      } else {
        await db.run(
          `INSERT INTO ratings (id, booking_id, rating, comment) VALUES (?, ?, ?, ?)`,
          [r.id, r.booking_id, r.rating, r.comment]
        );
      }
    }

    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
}

seed().then(() => process.exit(0));
