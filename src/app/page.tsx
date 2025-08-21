import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";

import TweetCard from "./components/TweetCard";
import type { Tweet } from "@/types";

const TWEETS_QUERY = `*[
  _type == "tweet"
] | order(createdAt desc)[0..5] {
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

const options = { next: { revalidate: 30 } };

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function IndexPage() {
  const extractNickname = (nickname: any): string => {
    if (typeof nickname === "string") return nickname;
    if (nickname && typeof nickname === "object" && nickname.current) {
      return nickname.current;
    }
    return "unknown";
  };

  try {
    const tweets = await client.fetch<Tweet[]>(TWEETS_QUERY, {}, options);

    return (
      <main className="container mx-auto min-h-screen max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Neueste Tweets von allen Usern
        </h1>

        {tweets.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <p>Noch keine Tweets vorhanden.</p>
            <p className="mt-2 text-sm">
              Fügen Sie Tweets über Ihr Sanity Studio hinzu.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {tweets.map((tweet: any) => (
              <TweetCard
                key={tweet._id}
                name={tweet.user?.name || "Unknown"}
                nickname={extractNickname(tweet.user?.nickname)}
                imgSrc={
                  tweet.user?.photo?.asset?._ref
                    ? urlFor(tweet.user.photo)?.url() || ""
                    : ""
                }
                text={tweet.text}
                publishedAt={tweet.createdAt}
                likes={0}
                retweets={0}
              />
            ))}
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return (
      <main className="container mx-auto min-h-screen max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-12 text-center text-red-500">
          Error connecting to Sanity
        </h1>
        <div className="text-center">
          <p>Error: {String(error)}</p>
        </div>
      </main>
    );
  }
}
