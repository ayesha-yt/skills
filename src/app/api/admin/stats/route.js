import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import getDb from '@/../db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // In a real app, check if role is 'admin'
    // if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const db = await getDb();
    
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const serviceCount = await db.get('SELECT COUNT(*) as count FROM services');
    const bookingCount = await db.get('SELECT COUNT(*) as count FROM bookings');
    const revenue = await db.get('SELECT SUM(total_amount) as total FROM bookings WHERE status = "confirmed"');

    // Category distribution
    const categories = await db.all('SELECT category as name, COUNT(*) as value FROM services GROUP BY category');

    return NextResponse.json({
      stats: [
        { label: "Total Users", value: userCount.count.toLocaleString(), change: "+12.5%", trend: "up" },
        { label: "Active Services", value: serviceCount.count.toLocaleString(), change: "+8.3%", trend: "up" },
        { label: "Revenue", value: `Rs. ${(revenue.total || 0).toLocaleString()}`, change: "+15.7%", trend: "up" },
        { label: "Bookings", value: bookingCount.count.toLocaleString(), change: "+5.2%", trend: "up" }
      ],
      categories
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
