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
    if (!auth?.id || !auth?.following) return;
    setLoading(true);
    try {
      const userIds = [auth.id, ...auth.following].join(',');

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


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })

  return (
    <div className="min-h-screen pb-10">
      {/* main container */}
      <div className="w-[95%] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Sidebar - Profile & Network */}
        <div className="hidden lg:col-span-3 lg:flex flex-col gap-6 h-fit sticky top-24">
          <UserInfo />
          <MutualPeople
            auth={auth}
            setAuth={setAuth}
            refreshPosts={fetchPosts}
          />
        </div>

        {/* Main Feed */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
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

        {/* Right Sidebar - Widgets */}
        <div className="hidden lg:col-span-3 lg:flex flex-col gap-6 h-fit sticky top-24">
          <Activity />
          <Blogs />
          <Events />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;