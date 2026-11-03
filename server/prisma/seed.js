import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const previousContent = {
  gallery: [
    { id: "gallery-arrival", name: "Grand arrival", description: "A welcoming first impression at Royal Palace.", image: "photo-1566073771259-6a8506099945" },
    { id: "gallery-room", name: "A restful room", description: "Thoughtfully designed spaces for a restorative stay.", image: "photo-1611892440504-42a792e24d32" },
    { id: "gallery-dining", name: "Dining moments", description: "Memorable meals served in distinctive surroundings.", image: "photo-1414235077428-338989a2e8c0" },
    { id: "gallery-corners", name: "Quiet corners", description: "Places to pause, read, and unwind.", image: "photo-1590490360182-c33d57733427" },
    { id: "gallery-evenings", name: "Golden evenings", description: "Relaxed evenings with warm hospitality.", image: "photo-1517248135467-4c7edcad34c4" },
    { id: "gallery-unwind", name: "Designed to unwind", description: "Comfort and calm in every detail.", image: "photo-1566665797739-1674de7a421a" },
    { id: "gallery-taste", name: "A taste of luxury", description: "Fresh flavours and refined dining experiences.", image: "photo-1515003197210-e0cd7184f8b5" },
    { id: "gallery-retreat", name: "Your own retreat", description: "A private space to make your stay your own.", image: "photo-1578683010236-d716f9a3f461" },
  ],
  amenities: [
    { id: "amenity-wellness", name: "Wellness & Pool", description: "Find your calm with restorative treatments and refreshing swims.", image: "https://images.unsplash.com/photo-1540555700478-4be289f3be3?auto=format&fit=crop&w=1000&q=85" },
    { id: "amenity-fitness", name: "Fitness Studio", description: "A considered space to keep your routine moving.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85" },
    { id: "amenity-dining", name: "Signature Dining", description: "Memorable meals, crafted with seasonal ingredients.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85" },
    { id: "amenity-wifi", name: "High-speed Wi-Fi", description: "Stay connected throughout your visit.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85" },
    { id: "amenity-parking", name: "Valet Parking", description: "Arrive and depart with ease.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85" },
    { id: "amenity-concierge", name: "24-hour Concierge", description: "Local guidance and thoughtful assistance, whenever you need it.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85" },
    { id: "amenity-housekeeping", name: "Daily Housekeeping", description: "A fresh, comfortable space every day.", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85" },
    { id: "amenity-business", name: "Business Lounge", description: "Quiet, well-equipped spaces for work and meetings.", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85" },
  ],
  dining: [
    { id: "dining-royal-table", name: "The Royal Table", description: "Contemporary Ethiopian & international", image: "photo-1414235077428-338989a2e8c0", menu: ["Doro Wat", "Grilled Ethiopian beef tenderloin", "Seasonal vegetarian tasting plate"] },
    { id: "dining-golden-hour", name: "Golden Hour Lounge", description: "Craft coffee, signature drinks & light bites", image: "photo-1517248135467-4c7edcad34c4", menu: ["Ethiopian coffee ceremony", "Royal Palace mocktail", "Teff and avocado bites"] },
    { id: "dining-garden", name: "Garden Terrace", description: "Fresh seasonal plates under the open sky", image: "photo-1515003197210-e0cd7184f8b5", menu: ["Garden salad", "Fresh seasonal pasta", "Fruit and honey dessert"] },
  ],
};

async function seedSetting(key, value) {
  const existing = await prisma.hotelSetting.findUnique({ where: { key } });
  if (existing) {
    let current = [];
    try {
      current = JSON.parse(existing.value);
    } catch {
      current = [];
    }

    if (Array.isArray(current) && current.length > 0) {
      const existingIds = new Set(current.map((item) => item?.id).filter(Boolean));
      const merged = current.map((item) => {
        const seeded = value.find((candidate) => candidate.id === item.id);
        return seeded && !item.menu ? { ...item, menu: seeded.menu } : item;
      });
      merged.push(...value.filter((item) => !existingIds.has(item.id)));
      if (merged.length === current.length) {
        console.log(`Preserved existing ${key} content.`);
        return;
      }

      await prisma.hotelSetting.update({
        where: { key },
        data: { value: JSON.stringify(merged) },
      });
      console.log(`Added missing previous ${key} records.`);
      return;
    }

    await prisma.hotelSetting.update({
      where: { key },
      data: { value: JSON.stringify(value) },
    });
    console.log(`Seeded empty ${key} content.`);
    return;
  }

  await prisma.hotelSetting.create({
    data: {
      key,
      value: JSON.stringify(value),
      description: `Public ${key} content`,
    },
  });
  console.log(`Created ${key} content.`);
}

try {
  for (const [key, value] of Object.entries(previousContent)) {
    await seedSetting(key, value);
  }
} finally {
  await prisma.$disconnect();
}
