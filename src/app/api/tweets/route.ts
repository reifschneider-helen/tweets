import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../sanity/client";
import type { Tweet } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const perPage = parseInt(searchParams.get("perPage") || "6");

    const start = page * perPage;
    const end = start + perPage - 1;

    const TWEETS_QUERY = `*[
      _type == "tweet"
    ] | order(createdAt desc)[${start}..${end}] {
      _id,
      text,
      createdAt,
      user-> {
        _id,
        name,
        nickname,
        photo {
          asset {
            _ref
          }
        },
        bio,
        joinedDate
      }
    }`;

    const tweets = await client.fetch<Tweet[]>(
      TWEETS_QUERY,
      {},
      { next: { revalidate: 30 } }
    );

    return NextResponse.json({
      tweets,
      hasMore: tweets.length === perPage,
    });
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweets" },
      { status: 500 }
    );
  }
}
