import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

const TWEETS_QUERY = `*[
  _type == "tweet" 
  && isPublished == true
] | order(publishedAt desc)[0...20] {
  _id,
  text,
  publishedAt,
  author-> {
    _id,
    name,
    nickname,
    profileImage {
      asset {
        _ref
      }
    }
  }
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
