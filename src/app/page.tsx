"use client";

import { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";

import TweetCard from "./components/TweetCard";
import type { Tweet } from "@/types";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default function IndexPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const extractNickname = (nickname: any): string => {
    if (typeof nickname === "string") return nickname;
    if (nickname && typeof nickname === "object" && nickname.current) {
      return nickname.current;
    }
    return "unknown";
  };

  const fetchTweets = async (pageNum: number, append = false) => {
    try {
      if (pageNum === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(`/api/tweets?page=${pageNum}&perPage=6`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (append) {
        setTweets((prev) => [...prev, ...data.tweets]);
      } else {
        setTweets(data.tweets);
      }

      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      console.error("Error fetching tweets:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tweets");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTweets(0);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTweets(nextPage, true);
  };

  if (loading) {
    return (
      <main className="container mx-auto min-h-screen max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Neueste Tweets von allen Usern
        </h1>
        <div className="text-center">
          <p>Lade Tweets...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto min-h-screen max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-12 text-center text-red-500">
          Error connecting to Sanity
        </h1>
        <div className="text-center">
          <p>Error: {error}</p>
        </div>
      </main>
    );
  }

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
        <>
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

          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                {loadingMore ? "Lade..." : "Mehr laden"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
