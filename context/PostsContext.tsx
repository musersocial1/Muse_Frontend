import InteractedPostsModal from "@/components/modals/InteractedPosts";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Post = any;

type OpenArgs = {
  liked?: Post[];
  disliked?: Post[];
  initialTab?: "liked" | "disliked";
};

type Ctx = {
  open: (args?: OpenArgs) => void;
  close: () => void;
};

const PostsContext = createContext<Ctx | null>(null);

export const PostsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [liked, setLiked] = useState<Post[]>([]);
  const [disliked, setDisliked] = useState<Post[]>([]);
  const [initialTab, setInitialTab] = useState<"liked" | "disliked">("liked");

  const open = useCallback((args?: OpenArgs) => {
    if (args?.liked) setLiked(args.liked);
    if (args?.disliked) setDisliked(args.disliked);
    setInitialTab(args?.initialTab ?? "liked");
    setVisible(true);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <PostsContext.Provider value={value}>
      {children}
      <InteractedPostsModal
        visible={visible}
        onClose={close}
        likedPosts={liked}
        dislikedPosts={disliked}
        initialTab={initialTab}
      />
    </PostsContext.Provider>
  );
};

export const useInteractedPostsModal = () => {
  const ctx = useContext(PostsContext);
  if (!ctx)
    throw new Error(
      "useInteractedPostsModal must be used within InteractedPostsProvider"
    );
  return ctx;
};
