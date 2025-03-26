import { fine } from "@/lib/fine";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout() {
  if (!fine) return <Navigate to='/' />;

  const { isPending, data } = fine.auth.useSession();
  useEffect(() => {
    if (!isPending && data) fine.auth.signOut();
  }, [data]);

  return !isPending && !data ? <Navigate to='/login' /> : null;
}
