import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import users from '../fixtures/users.json';
import photos from '../fixtures/photos.json';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/photography_e2e_db'
    }
  }
});

export class DatabaseSetup {
  constructor() {
    this.prisma = prisma;
  }

  async resetDatabase() {
    console.log('Resetting test database...');

    // Delete in order to respect foreign key constraints
    await this.prisma.booking.deleteMany({});
    await this.prisma.photo.deleteMany({});
    await this.prisma.user.deleteMany({});

    console.log('Database reset completed');
  }

  async seedUsers() {
    console.log('Seeding test users...');

    const createdUsers = {};

    for (const [key, userData] of Object.entries(users)) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await this.prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          user_type: userData.user_type
        }
      });

      createdUsers[key] = user;
    }

    console.log('Test users seeded successfully');
    return createdUsers;
  }

  async seedPhotos(photographerUserId) {
    console.log('Seeding test photos...');

    const createdPhotos = [];

    for (const photoData of photos.samplePhotos) {
      const photo = await this.prisma.photo.create({
        data: {
          user_id: photographerUserId,
          title: photoData.title,
          description: photoData.description,
          image: photoData.image,
          photo_type: photoData.photo_type
        }
      });

      createdPhotos.push(photo);
    }

    console.log('Test photos seeded successfully');
    return createdPhotos;
  }

  async seedBookings(photographerUserId, clientUserId) {
    console.log('Seeding test bookings...');

    const sampleBookings = [
      {
        bookingType: 'portrait',
        date: new Date('2024-12-01T10:00:00Z'),
        time: '10:00',
        photographer_id: photographerUserId,
        user_id: clientUserId
      },
      {
        bookingType: 'wedding',
        date: new Date('2024-12-15T14:30:00Z'),
        time: '14:30',
        photographer_id: photographerUserId,
        user_id: clientUserId
      }
    ];

    const createdBookings = [];

    for (const bookingData of sampleBookings) {
      const booking = await this.prisma.booking.create({
        data: bookingData
      });

      createdBookings.push(booking);
    }

    console.log('Test bookings seeded successfully');
    return createdBookings;
  }

  async setupFullTestData() {
    await this.resetDatabase();
    const seededUsers = await this.seedUsers();

    // Find photographer and user from seeded data
    const photographer = seededUsers.testPhotographer;
    const user = seededUsers.testUser;

    if (photographer && user) {
      await this.seedPhotos(photographer.id);
      await this.seedBookings(photographer.id, user.id);
    }

    return seededUsers;
  }

  async close() {
    await this.prisma.$disconnect();
  }
}

export default DatabaseSetup;