import { useEffect, useRef } from "react";
import Feed from "../components/Feed";
import { usePost } from "../hooks/usePost";
import SkeletonPostCard from "../../../components/ui/SkeletonPostCard";
import StateCard from "../../../components/ui/StateCard";
import Button from "../../../components/ui/Button";
import { usePageReveal } from "../../../hooks/usePageReveal";

function FeedPage() {
  const { getPostData, feed, loading, error } = usePost();
  const pageRef = useRef(null);

  usePageReveal(pageRef, []);

  useEffect(() => {
    getPostData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <SkeletonPostCard />
        <SkeletonPostCard />
      </section>
    );
  }

  if (error) {
    return (
      <StateCard
        title="Feed unavailable"
        description={error}
        action={
          <Button type="button" onClick={getPostData}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <section ref={pageRef}>
      <Feed feeds={feed} />
    </section>
  );
}

export default FeedPage;
