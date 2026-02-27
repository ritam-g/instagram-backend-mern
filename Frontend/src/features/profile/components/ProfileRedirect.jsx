import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import StateCard from "../../../components/ui/StateCard";
import { useAuth } from "../../auth/hooks/useAuth";
import { getMe } from "../../auth/services/auth.api.jsx";

function ProfileRedirect() {
  const { user, setUser } = useAuth();
  const [targetPath, setTargetPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function resolveCurrentProfile() {
      if (user?.username) {
        setTargetPath(`/profile/${encodeURIComponent(user.username)}`);
        setLoading(false);
        return;
      }

      try {
        const me = await getMe();
        if (me?.username) {
          setUser(me);
          setTargetPath(`/profile/${encodeURIComponent(me.username)}`);
        } else {
          setError("Unable to resolve your profile username.");
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Please login to view your profile.");
      } finally {
        setLoading(false);
      }
    }

    resolveCurrentProfile();
  }, [user, setUser]);

  if (targetPath) {
    return <Navigate to={targetPath} replace />;
  }

  if (loading) {
    return (
      <StateCard
        title="Opening profile"
        description="Loading your account details..."
      />
    );
  }

  return (
    <StateCard
      title="Profile unavailable"
      description={error || "Please login and try again."}
      action={
        <Link to="/">
          <Button type="button">Go to login</Button>
        </Link>
      }
    />
  );
}

export default ProfileRedirect;
