## Display all posts

## `components/PostCard.jsx`

```jsx
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { dummyUserData } from "../assets/assets";

export default function PostCard({ post }) {
  const postWithHashTags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600">$1</span>'
  );

  const [likes, setLikes] = useState(post.likes_count);
  const currentUser = dummyUserData;

  const handleLike = async () => {};

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* User info */}
      <div className="inline-flex items-center gap-3 cursor-pointer">
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow"
        />

        <div>
          <div className="flex items-center space-x-1">
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>

          <div className="text-gray-500 text-sm">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashTags }}
        />
      )}

      {/* Images */}
      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((img, index) => (
          <img
            src={img}
            key={index}
            alt=""
            className={`w-full h-48 object-cover rounded-lg ${
              post.image_urls.length === 1 && "col-span-2 h-auto"
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-4 h-4 cursor-pointer ${
              likes.includes(currentUser._id) && "text-red-500 fill-red-500"
            }`}
          />
          <span>{likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{12}</span>
        </div>

        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span>{7}</span>
        </div>
      </div>
    </div>
  );
}
```

## `components/RecentMessages.jsx`

```jsx
import { useEffect, useState } from "react";
import { dummyRecentMessagesData } from "../assets/assets";
import { Link } from "react-router-dom";
import moment from "moment";

export default function RecentMessages() {
  const [messages, setMessages] = useState([]);

  const fetchRecentMessages = async () => {
    setMessages(dummyRecentMessagesData);
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll [scrollbar-width:none]">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            key={index}
            className="flex items-start gap-2 py-2 hover:bg-slate-100"
          >
            <img
              src={message.from_user_id.profile_picture}
              alt=""
              className="w-8 h-8 rounded-full"
            />

            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-medium">{message.from_user_id.full_name}</p>
                <p className="text-[10px] text-slate-400">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-500">
                  {message.text ? message.text : "Media"}
                </p>
                {!message.seen && (
                  <p className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                    1
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## `Feed.jsx`

```jsx
<div
  className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex
      items-start justify-center xl:gap-8"
>
  {/* Stories and post list */}
  <div>
    <StoriesBar />

    <div className="p-4 space-y-6">
      {feeds.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  </div>

  {/* Right sidebar */}
  <div className="max-xl:hidden sticky top-0">
    <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
      <h3 className="text-slate-800 font-semibold">Sponsored</h3>
      <img
        src={assets.sponsored_img}
        alt=""
        className="w-full h-full rounded-md"
      />
      <p className="text-slate-600">Email marketing</p>
      <p className="text-slate-400">
        Get more done in less time with a smarter workflow.
      </p>
    </div>

    <RecentMessages />
  </div>
</div>
```
