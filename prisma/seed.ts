import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";
import { env } from "@/config/env";

const SALT_ROUNDS = 12;

async function main() {
  const passwordHash = await bcrypt.hash(env.ADMIN_SEED_PASSWORD, SALT_ROUNDS);

  await prisma.admin.upsert({
    where: { email: env.ADMIN_SEED_EMAIL },
    update: {},
    create: {
      email: env.ADMIN_SEED_EMAIL,
      passwordHash,
      name: "Admin",
    },
  });

  console.log("Admin criado/atualizado com sucesso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());