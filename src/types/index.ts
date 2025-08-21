export interface User {
  _id: string;
  name: string;
  nickname: string;
  bio?: string;
  photo?: {
    asset: {
      _ref: string;
    };
  };
  joinedDate: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface Tweet {
  _id: string;
  text: string;
  user: User;
  createdAt: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface UserWithStats extends User {
  totalTweets: number;
  totalLikes: number;
  totalRetweets: number;
}
