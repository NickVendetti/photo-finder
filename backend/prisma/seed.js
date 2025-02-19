import { PrismaClient, UserType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const user1 = await prisma.user.create({
    data: {
      username: "photographer1",
      email: "photo1@example.com",
      password: "hashedpassword1",
      user_type: UserType.PHOTOGRAPHER
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: "customer1",
      email: "customer1@example.com",
      password: "hashedpassword2",
      user_type: UserType.USER
    }
  });

  // Create a photographer profile
  const photographer = await prisma.photographer.create({
    data: {
      user_id: user1.id,
      bio: "Professional photographer specializing in portraits.",
      portfolio_url: "https://example.com/portfolio",
      location: "New York, USA",
      profile_picture: "https://example.com/profile.jpg"
    }
  });

  // Create a test photo
  const photo = await prisma.photo.create({
    data: {
      photographer_id: photographer.id,
      image: "https://example.com/sunset.jpg",
      is_public: true,
      tags: ["sunset", "nature"],
      source: "upload"
    }
  });

  console.log(" Test data seeded!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// import { PrismaClient } from "@prisma/client";
// import axios from "axios";

// const prisma = new PrismaClient();

// // Load API keys from environment variables
// const API_KEY = process.env.VITE_FLICKR_API_KEY;
// const API_SECRET = process.env.VITE_FLICKR_API_SECRET;
// const FLICKR_BASE_URL = "https://api.flickr.com/services/rest";

// // Utility function to get a random item from an array
// const getRandomItem = array => array[Math.floor(Math.random() * array.length)];

// // Function to convert image URL to base64
// async function convertImageToBase64(imageUrl) {
//   try {
//     const response = await axios.get(imageUrl, {
//       responseType: "arraybuffer"
//     });
//     const contentType = response.headers["content-type"];
//     const base64 = Buffer.from(response.data, "binary").toString("base64");
//     return `data:${contentType};base64,${base64}`;
//   } catch (error) {
//     console.error("Error converting image to base64:", error);
//     return null;
//   }
// }

// // Function to construct Flickr photo URL
// function constructPhotoUrl(photo) {
//   return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
// }

// // Enhanced function to fetch photos from Flickr with random selection
// async function fetchRandomPhoto(searchTerm) {
//   try {
//     const response = await axios.get(FLICKR_BASE_URL, {
//       params: {
//         method: "flickr.photos.search",
//         api_key: API_KEY,
//         text: searchTerm,
//         format: "json",
//         nojsoncallback: 1,
//         per_page: 20,
//         license: "4,5,6,7", // Use Creative Commons licensed photos only
//         sort: "relevance",
//         extras: "tags"
//       }
//     });

//     if (response.data.photos.photo.length === 0) {
//       throw new Error("No photos found");
//     }

//     // Select a random photo from the results
//     const randomPhoto = getRandomItem(response.data.photos.photo);
//     const photoUrl = constructPhotoUrl(randomPhoto);

//     // Convert the photo to base64
//     const base64Image = await convertImageToBase64(photoUrl);

//     if (!base64Image) {
//       throw new Error("Failed to convert image to base64");
//     }

//     return {
//       base64Image,
//       tags: randomPhoto.tags ? randomPhoto.tags.split(" ") : []
//     };
//   } catch (error) {
//     console.error("Error in fetchRandomPhoto:", error);
//     throw error;
//   }
// }

// async function main() {
//   try {
//     // Create test users
//     const user1 = await prisma.user.create({
//       data: {
//         username: "photographer1",
//         email: "photo1@example.com",
//         password: "hashedpassword1",
//         user_type: "photographer"
//       }
//     });

//     const user2 = await prisma.user.create({
//       data: {
//         username: "customer1",
//         email: "customer1@example.com",
//         password: "hashedpassword2",
//         user_type: "customer"
//       }
//     });

//     // Create a photographer profile with random profile picture
//     const profilePhoto = await fetchRandomPhoto("professional portrait");
//     const photographer = await prisma.photographer.create({
//       data: {
//         user_id: user1.id,
//         bio: "Professional photographer specializing in portraits.",
//         portfolio_url: "https://example.com/portfolio",
//         location: "New York, USA",
//         profile_picture: profilePhoto.base64Image
//       }
//     });

//     // Create multiple test photos with random Flickr images
//     const photoTopics = ["sunset", "nature", "architecture", "portrait"];

//     for (const topic of photoTopics) {
//       const photoData = await fetchRandomPhoto(topic);
//       await prisma.photo.create({
//         data: {
//           photographer_id: photographer.id,
//           image: photoData.base64Image,
//           is_public: true,
//           tags: photoData.tags,
//           source: "flickr"
//         }
//       });
//       console.log(`Created photo with topic: ${topic}`);
//     }

//     console.log("Test data seeded successfully!");
//   } catch (error) {
//     console.error("Error seeding data:", error);
//     throw error;
//   }
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
