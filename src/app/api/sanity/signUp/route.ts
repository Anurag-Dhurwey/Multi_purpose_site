// app/api/sanity/signUp/route.ts
import { signUpHandler } from 'next-auth-sanity';
import { client } from '../../../../utilities/sanityClient';

export const POST = signUpHandler(client,'user');