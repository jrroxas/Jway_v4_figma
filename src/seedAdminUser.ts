import { getPayload } from 'payload';
import config from './payload.config';

async function seedUser() {
  console.log('🌱 Seeding / Updating local admin user...');
  const payload = await getPayload({ config });

  const email = 'joey.concepcion@jway.com';
  const password = 'k9#mP2$xR8!v';

  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
  });

  if (existingUsers.docs.length > 0) {
    const user = existingUsers.docs[0];
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        name: 'Joey Concepcion',
        password: password,
      },
    });
    console.log('✅ Updated password and name for existing admin user:', email);
  } else {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Joey Concepcion',
        email: email,
        password: password,
      },
    });
    console.log('✅ Created new admin user:', email);
  }
}

seedUser()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding user:', err);
    process.exit(1);
  });
