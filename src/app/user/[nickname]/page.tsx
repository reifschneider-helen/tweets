"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import TweetCard from "../../components/TweetCard";
import { client } from "@/sanity/client";
import type { User, Tweet, UserWithStats } from "@/types";
import styles from "./UserProfile.module.scss";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

interface UserProfileData {
  user: UserWithStats;
  tweets: Tweet[];
  hasMore: boolean;
}

export default function UserProfilePage() {
  const params = useParams();
  const nickname = params.nickname as string;

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tweetsPage, setTweetsPage] = useState(0);

  const extractNickname = (nickname: any): string => {
    if (typeof nickname === "string") return nickname;
    if (nickname && typeof nickname === "object" && nickname.current) {
      return nickname.current;
    }
    return "unknown";
  };

  const fetchUserData = async (page: number = 0, append: boolean = false) => {
    try {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`/api/users/${nickname}?tweetsPage=${page}`);
      if (!response.ok) {
        throw new Error("User not found");
      }

      const data: UserProfileData = await response.json();

      if (append && profileData) {
        setProfileData({
          ...data,
          tweets: [...profileData.tweets, ...data.tweets],
        });
      } else {
        setProfileData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreTweets = () => {
    const nextPage = tweetsPage + 1;
    setTweetsPage(nextPage);
    fetchUserData(nextPage, true);
  };

  const formatJoinedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (nickname) {
      fetchUserData();
    }
  }, [nickname]);

  if (loading) {
    return (
      <main className="container mx-auto min-h-screen max-w-4xl p-8">
        <div className={styles.loading}>Lade Profil...</div>
      </main>
    );
  }

  if (error || !profileData) {
    return (
      <main className="container mx-auto min-h-screen max-w-4xl p-8">
        <div className={styles.error}>
          <h1>User nicht gefunden</h1>
          <p>{error}</p>
          <Link href="/" className={styles.backLink}>
            ← Zurück zu allen Tweets
          </Link>
        </div>
      </main>
    );
  }

  const { user, tweets, hasMore } = profileData;

  return (
    <main className="container mx-auto min-h-screen max-w-4xl p-8">
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Zurück
        </Link>
      </div>

      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          <Image
            src={
              user.photo?.asset?._ref
                ? urlFor(user.photo)?.url() || "/default-avatar.svg"
                : "/default-avatar.svg"
            }
            alt={`${user.name} Profilbild`}
            width={120}
            height={120}
            className={styles.profileImage}
          />
        </div>

        <div className={styles.profileInfo}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.nickname}>@{extractNickname(user.nickname)}</p>

          {user.bio && <p className={styles.bio}>{user.bio}</p>}

          <p className={styles.joinedDate}>
            📅 Dabei seit {formatJoinedDate(user.joinedDate)}
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{user.totalTweets}</span>
          <span className={styles.statLabel}>Posts</span>
        </div>
      </div>

      <section className={styles.tweetsSection}>
        <h2 className={styles.sectionTitle}>Posts von {user.name}</h2>

        {tweets.length === 0 ? (
          <div className={styles.noTweets}>
            <p>Noch keine Posts vorhanden.</p>
          </div>
        ) : (
          <>
            <div className={styles.tweetsGrid}>
              {tweets.map((tweet: any) => (
                <TweetCard
                  key={tweet._id}
                  name={tweet.user.name}
                  nickname={tweet.user.nickname}
                  imgSrc={
                    tweet.user.photo?.asset?._ref
                      ? urlFor(tweet.user.photo)?.url() || ""
                      : ""
                  }
                  text={tweet.text}
                  publishedAt={tweet.createdAt}
                />
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={loadMoreTweets}
                  disabled={loadingMore}
                  className={styles.loadMoreButton}
                >
                  {loadingMore ? "Lädt..." : "Weitere 3 Posts laden"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
