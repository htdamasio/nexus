import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export async function GET(req: NextRequest) {
  try {
    // await sleep(2000);
    
    // const tags: {}[] = [] 
    // const genres: {}[] = []
    // return new Response(JSON.stringify({tags, genres, success: true }), {
    //     status: 201,
    //   })
    const tags = await prisma.tag.findMany();
    // const genres = await prisma.genre.findMany();

    return new Response(JSON.stringify({tags, success: true }), {
    // // return new Response(JSON.stringify({success: true }), {
      status: 201,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'unexpected error', success: false }), {
      status: 500,
    })
  }
}