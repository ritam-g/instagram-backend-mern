import { useEffect, useRef } from "react";
import Feed from "../components/Feed";
import { usePost } from "../hooks/usePost";
import { PostSkeleton } from "../../../components/ui/Skeleton";
import { usePageReveal } from "../../../hooks/usePageReveal";

function FeedPage() {
  const { getPostData, feed, loading, pagination } = usePost();
  const pageRef = useRef(null);
  const observerRef = useRef(null);

  usePageReveal(pageRef, []);

  useEffect(() => {
    getPostData(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading) return;

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };

    const target = document.querySelector("#scroll-sentinel");
    if (!target) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && pagination.hasNextPage) {
        getPostData(pagination.currentPage + 1, true);
      }
    }, options);

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loading, pagination.hasNextPage, pagination.currentPage]);

  return (
    <section ref={pageRef} className="pb-10">
      <Feed feeds={feed} />

      {loading && feed.length === 0 && (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      <div id="scroll-sentinel" className="h-10 w-full flex items-center justify-center">
        {loading && feed.length > 0 && <span className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full"></span>}
      </div>
    </section>
  );
}

export default FeedPage;
