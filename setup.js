const fs = require('fs');

// .env.local faylini o'chirish
if (fs.existsSync('.env.local')) {
  fs.unlinkSync('.env.local');
  console.log('.env.local fayli o\'chirildi!');
} else {
  console.log('.env.local fayli topilmadi.');
}

// .env faylini yaratish
const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://gdneozdqehcisnkvzman.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkbmVvemRxZWhjaXNua3Z6bWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjM3MTYsImV4cCI6MjA2MTIzOTcxNn0.n3toFEdeXWtUEKKjJYoQPg6yHM74giwfy4xCVdAyC1s
`;

fs.writeFileSync('.env', envContent, { encoding: 'utf8' });
console.log('.env fayli yaratildi va yozildi!');