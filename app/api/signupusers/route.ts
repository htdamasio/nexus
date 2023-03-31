import axios from 'axios'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({response: 'Hello from GET userssignup, Next.js!'})
}

export async function POST(req: NextRequest) {
  const { email, userType } = await req.json();
  if (!email || !email.length) {
    return new NextResponse(JSON.stringify({message:'Email is required'}), {
      status: 400,
    });     
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY
  const API_SERVER = process.env.MAILCHIMP_API_SERVER
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
  
  const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`

  const data = {
    email_address: email,
    status: 'subscribed',
    tags: [userType],

  }

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `api_key ${API_KEY}`
    }
  }
  return await axios
  .post(url, data, options)
  .then(res => {
    return new NextResponse(JSON.stringify({ message: 'success' }), {
      status: 201,
    });
  })
  .catch(err => {
    if (err.response.data.status != 500) {
      return new Response(JSON.stringify({message: "There was an error signing up to the beta. Shoot an email at nexus@nexuslit.com and you'll be added to the list." }), {
        status: err.response.data.status,
      });
    } else {
      return new Response(JSON.stringify({message: "Unexpected error" }), {
        status: 500,
      });
    }
  })   
}