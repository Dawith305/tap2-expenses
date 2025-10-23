import { ConvexReactClient } from 'convex/react';
import { PUBLIC_CONVEX_URL } from '$env/static/public';

export const convex = new ConvexReactClient(PUBLIC_CONVEX_URL);
