import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Simple hashing for MVP (in production, use bcrypt/argon2)
const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  const adminUsername = 'Admin123'
  const adminPassword = '123Admin'

  const existingAdmin = await prisma.teacher.findUnique({
    where: { username: adminUsername },
  })

  if (!existingAdmin) {
    await prisma.teacher.create({
      data: {
        name: 'แอดมินหลัก',
        username: adminUsername,
        password: hashPassword(adminPassword),
        role: 'ADMIN',
      },
    })
    console.log('Created Main Admin')
  } else {
    console.log('Main Admin already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
