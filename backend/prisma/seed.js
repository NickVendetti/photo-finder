import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);

  // --- Regular user ---
  let user = await prisma.user.findUnique({ where: { email: "user@example.com" } });
  if (!user) {
    const userPassword = await bcrypt.hash("password123", salt);
    user = await prisma.user.create({
      data: {
        username: "seed_user",
        email: "user@example.com",
        password: userPassword,
        user_type: "USER"
      }
    });
    console.log(`User created: ${user.email}`);
  } else {
    console.log(`User already exists: ${user.email}`);
  }

  // --- Photographer user ---
  let photographer = await prisma.user.findUnique({
    where: { email: "photographer@example.com" }
  });
  if (!photographer) {
    const photographerPassword = await bcrypt.hash("password123", salt);
    photographer = await prisma.user.create({
      data: {
        username: "seed_photographer",
        email: "photographer@example.com",
        password: photographerPassword,
        user_type: "PHOTOGRAPHER"
      }
    });
    console.log(`Photographer created: ${photographer.email}`);
  } else {
    console.log(`Photographer already exists: ${photographer.email}`);
  }

  // --- 6 Photos linked to the photographer (only if they have none yet) ---
  const existingPhotoCount = await prisma.photo.count({
    where: { user_id: photographer.id }
  });

  if (existingPhotoCount === 0) {
    const photos = [
      {
        title: "Golden Hour Portrait",
        description: "A warm portrait taken during golden hour.",
        photo_type: "portrait",
        image: "https://picsum.photos/seed/portrait1/800/600"
      },
      {
        title: "Wedding Ceremony",
        description: "Couple exchanging vows in an outdoor ceremony.",
        photo_type: "wedding",
        image: "https://picsum.photos/seed/wedding1/800/600"
      },
      {
        title: "Mountain Landscape",
        description: "Sweeping view of snow-capped mountains at dawn.",
        photo_type: "landscape",
        image: "https://picsum.photos/seed/landscape1/800/600"
      },
      {
        title: "Corporate Event",
        description: "Highlights from a downtown business conference.",
        photo_type: "event",
        image: "https://picsum.photos/seed/event1/800/600"
      },
      {
        title: "Family at the Park",
        description: "Candid family session in a sunny park.",
        photo_type: "family",
        image: "https://picsum.photos/seed/family1/800/600"
      },
      {
        title: "Studio Portrait",
        description: "Clean studio portrait with soft lighting.",
        photo_type: "portrait",
        image: "https://picsum.photos/seed/portrait2/800/600"
      }
    ];

    for (const photoData of photos) {
      await prisma.photo.create({
        data: { user_id: photographer.id, ...photoData }
      });
      console.log(`Photo created: "${photoData.title}"`);
    }
  } else {
    console.log(`Photographer already has ${existingPhotoCount} photo(s) — skipping photo seed.`);
  }

  console.log("\nSeed complete — accounts and photos ready.");
  console.log("  user@example.com         / password123  (USER)");
  console.log("  photographer@example.com / password123  (PHOTOGRAPHER)");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
