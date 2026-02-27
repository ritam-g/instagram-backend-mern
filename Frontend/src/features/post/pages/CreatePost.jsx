import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";
import { usePost } from "../hooks/usePost";
import Button from "../../../components/ui/Button";
import { usePageReveal } from "../../../hooks/usePageReveal";

function CreatePost() {
  const [imagePreview, setImagePreview] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const imageFileRef = useRef(null);
  const previewRef = useRef(null);
  const pageRef = useRef(null);

  const { setfeed, createPostHandeller } = usePost();
  const navigate = useNavigate();

  usePageReveal(pageRef, []);

  useEffect(() => {
    if (!previewRef.current || !imagePreview) {
      return;
    }

    gsap.fromTo(
      previewRef.current,
      { opacity: 0.4, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" }
    );
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setError("");
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePost = async (event) => {
    event.preventDefault();

    const selectedFile = imageFileRef.current?.files?.[0];
    if (!selectedFile) {
      setError("Select an image before sharing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const { post, message } = await createPostHandeller(selectedFile, caption);
      setfeed((prevFeed) => [post, ...(prevFeed || [])]);

      toast.success(message || "Post created successfully");
      navigate("/feed-page");
    } catch (requestError) {
      const message = requestError?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={pageRef} className="mx-auto w-full max-w-xl">
      <div className="glass-surface rounded-2xl p-5 sm:p-7">
        <h2 className="font-display text-2xl font-semibold">Create new post</h2>
        <p className="mt-1 text-sm text-muted">
          Upload an image and add a caption for your feed.
        </p>

        <form onSubmit={handlePost} className="mt-6 flex flex-col gap-5">
          <label
            htmlFor="image"
            className="group block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-300/80 bg-white/50 p-2 transition hover:border-[var(--accent)] dark:border-slate-600 dark:bg-slate-900/50"
          >
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800/60">
              {imagePreview ? (
                <img
                  ref={previewRef}
                  src={imagePreview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="text-sm text-muted">Click to upload image</p>
              )}
            </div>
          </label>

          <input
            ref={imageFileRef}
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />

          <div className="space-y-2">
            <textarea
              name="caption"
              placeholder="Write a caption..."
              rows="4"
              maxLength={2200}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="w-full rounded-xl border border-white/60 bg-white/70 p-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:bg-white dark:border-slate-600 dark:bg-slate-900/60"
            />
            <p className="text-right text-xs text-muted">{caption.length}/2200</p>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <Button type="submit" isLoading={submitting} disabled={!imagePreview}>
            Share post
          </Button>
        </form>
      </div>
    </section>
  );
}

export default CreatePost;
