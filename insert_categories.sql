-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert categories with proper slugs and Uzbek names
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Flagman telefonlar', 'flagship', 'Eng ilg''or texnologiyali premium smartfonlar', '/images/categories/flagship.jpg'),
  ('O''rta narxdagi telefonlar', 'mid-range', 'Qulay narxlarda ajoyib ishlash', '/images/categories/mid-range.jpg'),
  ('Arzon telefonlar', 'budget', 'Sifatdan voz kechmasdan arzon variantlar', '/images/categories/budget.jpg'),
  ('Bukiladigan telefonlar', 'foldable', 'Egiluvchan displeylar bilan innovatsion dizaynlar', '/images/categories/foldable.jpg'),
  ('O''yin telefonlari', 'gaming', 'Mobil o''yinlar uchun moslashtirilgan yuqori samarali qurilmalar', '/images/categories/gaming.jpg'),
  ('Kamera telefonlari', 'camera', 'Kontent yaratuvchilar uchun ajoyib suratga olish imkoniyatlari', '/images/categories/camera.jpg'); 