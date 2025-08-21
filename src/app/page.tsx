import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client"; // Add this import

import TweetCard from "./components/TweetCard";
import type { Tweet } from "@/types";

// Query für alle Tweets mit User-Daten
const TWEETS_QUERY = `*[
  _type == "tweet"
] | order(createdAt desc)[0...20] {
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
            {tweets.map((tweet: any) => {
              // Extract nickname safely
              let nickname = "unknown";
              if (tweet.user?.nickname) {
                if (typeof tweet.user.nickname === "string") {
                  nickname = tweet.user.nickname;
                } else if (tweet.user.nickname.current) {
                  nickname = tweet.user.nickname.current;
                } else {
                  nickname = String(tweet.user.nickname);
                }
              }

              return (
                <TweetCard
                  key={tweet._id}
                  name={tweet.user?.name || "Unknown"}
                  nickname={nickname}
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
              );
            })}
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
