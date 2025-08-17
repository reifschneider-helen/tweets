import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import TweetCard from "./components/TweetCard";
import { client } from "@/sanity/client";

const TWEETS_QUERY = `*[
  _type == "tweetCard"
  && defined(nickname)
]|order(_createdAt desc)[0...12]{_id, name, nickname, text, photo{asset{_ref}}, _createdAt}`;

const options = { next: { revalidate: 30 } };

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function IndexPage() {
  const tweets = await client.fetch<SanityDocument[]>(
    TWEETS_QUERY,
    {},
    options
  );

  return (
    <main className="container mx-auto min-h-screen max-w-6xl p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">Tweets</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet._id}
            name={tweet.name}
            nickname={tweet.nickname}
            imgSrc={urlFor(tweet.photo)?.url() || ""}
            text={tweet.text}
          />
        ))}
      </div>
    </main>
  );
}
