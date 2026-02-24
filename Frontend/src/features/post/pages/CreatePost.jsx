import React, { useRef, useState } from "react";
import "./createPost.scss";
import { usePost } from "../hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const [imagePreview, setImagePreview] = useState(null);
    const imageFile = useRef(null)
    const [caption, setcaption] = useState("")
    const { setfeed, feed, createPostHandeller } = usePost()
    const navigate = useNavigate()
    const handleImageChange = (e) => {

        const file = e.target.files[0];



        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };
    async function handelPost(e) {
        e.preventDefault();

        const PostFile = imageFile.current?.files[0];

        if (!PostFile) {
            toast.error("Please select an image 📷");
            return;
        }

        try {
            const { post, message } =
            await createPostHandeller(PostFile, caption);

            // add new post to feed
            setfeed(prev => [post, ...prev]);

            toast.success(message || "Post created successfully 🚀");

            navigate("/feed-page");

        } catch (error) {
            console.log(error);
            
            toast.error("Something went wrong ❌");
        }
    }

    return (
        <div className="create">
            <div className="create__card">

                <h2 className="create__title">Create New Post</h2>

                <form onSubmit={handelPost} className="create__form">

                    {/* IMAGE UPLOAD */}
                    <div className="create__image-upload">
                        <label htmlFor="image" className="create__upload-box">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    className="create__preview"
                                />
                            ) : (
                                <span className="create__placeholder">
                                    Click to upload image
                                </span>
                            )}
                        </label>

                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                            ref={imageFile}
                        />
                    </div>

                    {/* CAPTION */}
                    <div className="create__field">
                        <textarea
                            name="caption"
                            placeholder="Write a caption..."
                            className="create__textarea"
                            rows="3"
                            value={caption}
                            onInput={(e) => setcaption(e.target.value)}
                        />
                    </div>

                    {/* BUTTON */}
                    <button type="submit" className="create__btn">
                        Share
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreatePost;