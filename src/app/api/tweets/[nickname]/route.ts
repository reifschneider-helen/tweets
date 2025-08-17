import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

const TWEET_QUERY = `*[_type == "tweetCard" && nickname == $nickname][0]{
  _id,
  name,
  nickname,
  text,
  photo,
  _createdAt
}`;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;
    const tweet = await client.fetch(TWEET_QUERY, { nickname });

    if (!tweet) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    return NextResponse.json(tweet);
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweet" },
      { status: 500 }
    );
  }
}
