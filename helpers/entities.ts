type Course = {
  name: string;
  tags: string[];
  featuredUrl: string;
  videoUrls: string[];
  id: string;
  teacherId: string;
  ratingAverage: number;
  ownRating?: number;
};

type Chat = {
  id: string;
  messages: Message[];
  otherId: string;
  otherUsername: string;
};

type Message = {
  text: string;
  date: Date;
  id: string;
  userId: string;
  username: string;
  own: boolean;
};

type SidebarChat = {
  username: string;
  id: string;
};

export type { Course, Message, Chat, SidebarChat };
