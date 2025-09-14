## `Feed.jsx`

```jsx
import { useEffect, useState } from "react";
import { dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";

export default function Feed() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div
      className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex
      items-start justify-center xl:gap-8"
    >
      {/* Stories and post list */}
      <div>
        <StoriesBar />

        <div className="p-4 space-y-6">List of posts</div>
      </div>

      {/* Right sidebar */}
      <div>
        <div>
          <h1>Sponsored</h1>
        </div>

        <h1>Recent messages</h1>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
```

## `components/StoriesBar.jsx`

```jsx
import { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from "moment";
import StoryModal from "./StoryModal";

export default function StoriesBar() {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  const fetchStories = async () => {
    setStories(dummyStoriesData);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div
      className="w-screen sm:w-[calc(100vw-240px)]
      lg:max-w-2xl no-scrollbar overflow-x-auto px-4"
    >
      <div className="flex gap-4 pb-5">
        {/* Add story card */}
        <div
          onClick={() => setShowModal(true)}
          className="rounded-lg shadow-sm min-w-[120px] max-w-[120px] max-h-[160px]
          aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200
          border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>

            <p className="text-sm font-medium text-slate-700 text-center">
              Create Story
            </p>
          </div>
        </div>

        {/* Story cards */}
        {stories.map((story, index) => (
          <div
            key={index}
            className={`relative rounded-lg shadow min-w-[120px] max-w-[120px] max-h-[160px] cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95`}
          >
            <img
              src={story.user.profile_picture}
              alt=""
              className="absolute size-8 top-3 left-3 z-100 rounded-full ring ring-gray-100 shadow"
            />
            <p className="absolute top-[4.5rem] left-3 text-white/60 text-sm truncate max-w-[6rem]">
              {story.content}
            </p>
            <p className="text-white absolute bottom-1 right-2 z-100 text-xs">
              {moment(story.createdAt).fromNow()}
            </p>

            {story.media_type !== "text" && (
              <div className="absolute inset-0 z-10 rounded-lg bg-black overflow-hidden">
                {story.media_type === "image" ? (
                  <img
                    src={story.media_url}
                    alt=""
                    className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                  />
                ) : (
                  <video
                    src={story.media_url}
                    className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add story modal */}
      {showModal && (
        <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />
      )}
    </div>
  );
}
```

## `components/StoryModal.jsx`

```jsx
import { ArrowLeft, Sparkle, TextIcon, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StoryModal({ setShowModal, fetchStories }) {
  const bgColors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488",
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateStory = async () => {};

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        <div
          className="rounded-lg h-96 flex items-center justify-center"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
              placeholder="What's on your mind?"
            />
          )}

          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full"
              />
            ) : (
              <video src={previewUrl} className="object-contain max-h-full" />
            ))}
        </div>

        <div className="flex mt-4 gap-2">
          {bgColors.map((color) => (
            <button
              onClick={(e) => setBackground(color)}
              key={color}
              className="w-6 h-6 rounded-full ring cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "text" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <TextIcon size={18} /> Text
          </button>
          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "media" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <input
              onChange={(e) => {
                handleMediaUpload(e);
                setMode("media");
              }}
              type="file"
              accept="image/*, video/*"
              className="hidden"
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>

        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Saving...",
              success: <p>Story Added</p>,
              error: (e) => <p>{e.message}</p>,
            })
          }
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
        >
          <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>
  );
}
```

## `App.jsx`

```jsx
import { Toaster } from "react-hot-toast";

export default function App() {
  const { user } = useUser();

  return (
    <>
      <Toaster />
```

---

## View Stories

## `components/StoryViewer.jsx`

```jsx
import { BadgeCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function StoryViewer({ viewStory, setViewStory }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer, progressInterval;

    if (viewStory && viewStory.media_type !== "video") {
      setProgress(0);

      const duration = 10000;
      const setTime = 100;
      let elapsed = 0;

      progressInterval = setInterval(() => {
        elapsed += setTime;
        setProgress((elapsed / duration) * 100);
      }, setTime);

      // Close story after duration (10sec)
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [viewStory]);

  const handleClose = () => {
    setViewStory(null);
  };

  if (!viewStory) return null;

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return (
          <img
            src={viewStory.media_url}
            alt=""
            className="max-w-full max-h-screen object-contain"
          />
        );

      case "video":
        return (
          <video
            onEnded={handleClose}
            src={viewStory.media_url}
            className="max-h-screen"
            controls
            autoPlay
          />
        );

      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center">
            {viewStory.content}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen bg-black/90 z-110 flex items-center justify-center"
      style={{
        backgroundColor:
          viewStory.media_type === "text"
            ? viewStory.background_color
            : "#000000",
      }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* User info - top left */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
        <img
          src={viewStory.user?.profile_picture}
          alt=""
          className="size-7 sm:size-8 rounded-full object-cover border border-white"
        />
        <div className="text-white font-medium flex items-center gap-1.5">
          <span>{viewStory.user?.full_name}</span>
          <BadgeCheck size={18} />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
      >
        <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
      </button>

      {/* Content wrapper */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
```

## `StoriesBar.jsx`

```jsx
        {/* Story cards */}
        {stories.map((story, index) => (
          <div
            onClick={() => setViewStory(story)}

...

      {/* Add story modal */}
      {showModal && (
        <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />
      )}

      {/* View story modal */}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
}

```

## `index.css`

```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```
