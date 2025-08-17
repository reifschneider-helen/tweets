import Image from "next/image";
import styles from "./TweetCard.module.scss";

type Props = {
  name: string;
  nickname: string;
  imgSrc: string;
  text: string;
};

export default function TweetCard({ name, nickname, imgSrc, text }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles["card-top"]}>
        <Image
          className={styles["profile-img"]}
          src={imgSrc}
          width={48}
          height={48}
          aria-label="user foto"
          alt="user foto"
        />
        <div className={styles["user-name"]}>
          <p className={styles["text-pimary"]}>{name}</p>
          <a className={styles["text-link"]}>@{nickname}</a>
        </div>
      </div>
      <p className={styles["text-secondary"]}>{text}</p>
    </div>
  );
}
