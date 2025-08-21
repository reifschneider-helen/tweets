import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

// Query für User-Details mit Stats
const USER_QUERY = `*[_type == "user" && nickname == $nickname][0] {
  _id,
  name,
  nickname,
  bio,
  photo {
    asset {
      _ref
    }
  },
  joinedDate,
  "totalTweets": count(*[_type == "tweet" && user._ref == ^._id])
}`;

// Query für User Tweets mit Paginierung
const USER_TWEETS_QUERY = `*[
  _type == "tweet" 
  && user->nickname == $nickname
] | order(createdAt desc)[$start...$end] {
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
    }
  }
}`;

export async function GET(
  request: Request,
  { params }: { params: { nickname: string } }
) {
  try {
    const { nickname } = await params;
    const { searchParams } = new URL(request.url);
    const tweetsPage = parseInt(searchParams.get("tweetsPage") || "0");
    const tweetsPerPage = 3;

    const start = tweetsPage * tweetsPerPage;
    const end = start + tweetsPerPage;

    // User-Daten und Tweets parallel laden
    const [user, tweets] = await Promise.all([
      client.fetch(USER_QUERY, { nickname }),
      client.fetch(USER_TWEETS_QUERY, {
        nickname,
        start,
        end,
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user,
      tweets,
      hasMore: tweets.length === tweetsPerPage,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
