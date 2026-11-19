import { getPayload } from 'payload';
import config from '@/payload.config';

const globalPayload = global as any;

let cached = globalPayload.payload;

if (!cached) {
  console.log('[Payload Cache] Initializing global cache object');
  cached = globalPayload.payload = {
    client: null,
    promise: null,
  };
}

export const getPayloadClient = async () => {
  if (cached.client) {
    console.log('[Payload Cache] HIT - returning cached client');
    return cached.client;
  }

  if (!cached.promise) {
    console.log('[Payload Cache] MISS - initializing new Payload instance');
    cached.promise = getPayload({
      config,
    });
  } else {
    console.log('[Payload Cache] WAIT - waiting for existing client promise');
  }

  try {
    cached.client = await cached.promise;
    console.log('[Payload Cache] Loaded client successfully');
  } catch (e) {
    console.error('[Payload Cache] Failed to load client', e);
    cached.promise = null;
    throw e;
  }

  return cached.client;
};
