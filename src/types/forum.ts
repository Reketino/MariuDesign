export type ForumCategory = {
id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ForumTopic = {
id: string;
  category_id: string;
  user_id: string | null;
  product_id: string | null;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
};

export type ForumReply = {
id: string;
  topic_id: string;
  user_id: string | null;
  content: string;
  is_official: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
};

export type ForumTopicWithReplies = ForumTopic & {
    forum_replies: ForumReply[];
};