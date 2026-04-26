import { useState } from "react";
import Activity from "./Activity";
import Events from "./Events";
import UserInfo from "./UserInfo";
import Blogs from "./Blogs";
import Posts from "../posts/Posts";
import WelcomeBanner from "./WelcomeBanner";
import MutualPeople from './MutualPeople';
import useAuth from "../../auth/useAuth";
import { axiosPrivate } from "../../api/axios";

const POST_URL = '/api/posts'

const Dashboard = () => {
  const { auth, setAuth } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page = 1) => {
    if (!auth?.id) return;
    setLoading(true);
    try {
      const following = Array.isArray(auth?.following) ? auth.following : [];
      const userIds = [auth.id, ...following].join(',');

      const response = await axiosPrivate.get(`${POST_URL}?page=${page}&limit=10&userIds=${userIds}`, {
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`
        }
      });

      setPosts(response.data.posts);
      (posts.length <= 0) && setCurrentPage(1);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen pb-20">
      {/* Main container */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 md:px-10">

        {/* Left Sidebar - Digital Passport & Network Signals */}
        <div className="hidden lg:col-span-3 lg:flex flex-col gap-10 h-fit sticky top-28">
          <UserInfo />
          <MutualPeople
            auth={auth}
            setAuth={setAuth}
            refreshPosts={fetchPosts}
          />
        </div>

        {/* Main Feed - Central Intelligence */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-10">
          <WelcomeBanner />
          <Posts
            auth={auth}
            POST_URL={POST_URL}
            setAuth={setAuth}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            fetchPosts={fetchPosts}
            posts={posts}
            setPosts={setPosts}
          />
        </div>

        {/* Right Sidebar - System Widgets */}
        <div className="hidden lg:col-span-3 lg:flex flex-col gap-10 h-fit sticky top-28">
          <Activity />
          <Blogs />
          <Events />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;