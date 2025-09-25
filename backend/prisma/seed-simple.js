import { PrismaClient, UserType } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed database...");

  // Hash passwords
  const hashedPassword = await bcryptjs.hash("testpass123", 10);

  // Create test users
  const photographer = await prisma.user.upsert({
    where: { email: "testphotographer@example.com" },
    update: {},
    create: {
      username: "testphotographer",
      email: "testphotographer@example.com",
      password: hashedPassword,
      user_type: UserType.PHOTOGRAPHER,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "testuser@example.com" },
    update: {},
    create: {
      username: "testuser",
      email: "testuser@example.com",
      password: hashedPassword,
      user_type: UserType.USER,
    },
  });

  // Create some sample photos
  const photo1 = await prisma.photo.create({
    data: {
      user_id: photographer.id,
      image: "https://example.com/photo1.jpg",
      photo_type: "portrait",
      title: "Beautiful Portrait",
      description: "A stunning portrait photograph",
    },
  });

  const photo2 = await prisma.photo.create({
    data: {
      user_id: photographer.id,
      image: "https://example.com/photo2.jpg",
      photo_type: "landscape",
      title: "Mountain Landscape",
      description: "A breathtaking mountain landscape",
    },
  });

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      bookingType: "Portrait Session",
      date: new Date("2024-03-15T10:00:00Z"),
      time: "10:00 AM",
      photographer_id: photographer.id,
      user_id: customer.id,
    },
  });

  console.log("Database seeded successfully!");
  console.log(`Created photographer: ${photographer.username}`);
  console.log(`Created customer: ${customer.username}`);
  console.log(`Created ${photo1.title} and ${photo2.title}`);
  console.log(`Created booking: ${booking.bookingType}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });