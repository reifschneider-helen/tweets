import Image from "next/image";
import Link from "next/link";
import styles from "./TweetCard.module.scss";

type Props = {
  name: string;
  nickname: string;
  imgSrc: string;
  text: string;
  publishedAt?: string;
  likes?: number;
  retweets?: number;
};

export default function TweetCard({
  name,
  nickname,
  imgSrc,
  text,
  publishedAt,
  likes = 0,
  retweets = 0,
}: Props) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Ensure nickname is a string
  const safeNickname =
    typeof nickname === "string" ? nickname : String(nickname || "unknown");

  return (
    <div className={styles.card}>
      <div className={styles["card-top"]}>
        <Link href={`/user/${safeNickname}`} className={styles["profile-link"]}>
          <Image
            className={styles["profile-img"]}
            src={imgSrc}
            width={48}
            height={48}
            aria-label="user foto"
            alt="user foto"
          />
        </Link>
        <div className={styles["user-name"]}>
          <Link href={`/user/${safeNickname}`} className={styles["name-link"]}>
            <p className={styles["text-primary"]}>{name}</p>
          </Link>
          <Link href={`/user/${safeNickname}`} className={styles["text-link"]}>
            @{safeNickname}
          </Link>
        </div>
        {publishedAt && (
          <span className={styles["tweet-date"]}>
            {formatDate(publishedAt)}
          </span>
        )}
      </div>
      <p className={styles["text-secondary"]}>{text}</p>

      {(likes > 0 || retweets > 0) && (
        <div className={styles["tweet-stats"]}>
          {likes > 0 && <span className={styles["stat-item"]}>❤️ {likes}</span>}
          {retweets > 0 && (
            <span className={styles["stat-item"]}>🔄 {retweets}</span>
          )}
        </div>
      )}
    </div>
  );
}
