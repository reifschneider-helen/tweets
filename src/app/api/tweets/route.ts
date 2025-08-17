import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

const TWEETS_QUERY = `*[
  _type == "tweetCard"
  && defined(nickname)
]|order(_createdAt desc){
  _id,
  name,
  nickname,
  text,
  photo,
  _createdAt
}`;

export async function GET() {
  try {
    const tweets = await client.fetch(TWEETS_QUERY);
    return NextResponse.json(tweets);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweets" },
      { status: 500 }
    );
  }
}
