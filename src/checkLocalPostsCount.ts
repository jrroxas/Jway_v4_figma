import { getPayloadClient } from './lib/getPayload';

async function check() {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'posts',
  });
  console.log(`Local SQLite Posts Count: ${res.docs ? res.docs.length : 0}`);
  if (res.docs && res.docs.length > 0) {
    console.log(res.docs.map((d: any) => ({ id: d.id, title: d.title, slug: d.slug, coverImageUrl: d.coverImageUrl })));
  }
  process.exit(0);
}

check();
