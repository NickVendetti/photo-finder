// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   // Create test users
//   const user1 = await prisma.user.create({
//     data: {
//       username: "photographer1",
//       email: "photo1@example.com",
//       password: "hashedpassword1",
//       user_type: "photographer"
//     }
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       username: "customer1",
//       email: "customer1@example.com",
//       password: "hashedpassword2",
//       user_type: "customer"
//     }
//   });

//   // Create a photographer profile
//   const photographer = await prisma.photographer.create({
//     data: {
//       user_id: user1.id,
//       bio: "Professional photographer specializing in portraits.",
//       portfolio_url: "https://example.com/portfolio",
//       location: "New York, USA",
//       profile_picture: "https://example.com/profile.jpg"
//     }
//   });

//   // Create a test photo
//   const photo = await prisma.photo.create({
//     data: {
//       photographer_id: photographer.id,
//       image: "https://example.com/sunset.jpg",
//       is_public: true,
//       tags: ["sunset", "nature"],
//       source: "upload"
//     }
//   });

//   console.log(" Test data seeded!");
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
