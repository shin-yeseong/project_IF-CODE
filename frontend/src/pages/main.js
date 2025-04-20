import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/main.module.css';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';

const Main = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentCompetitions, setRecentCompetitions] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 최신 게시글 가져오기
        const postsResponse = await axios.get('http://localhost:8080/api/posts/recent');
        setRecentPosts(postsResponse.data);

        // 최신 공모전 가져오기
        const competitionsResponse = await axios.get('http://localhost:8080/api/competitions?page=0&size=2');
        setRecentCompetitions(competitionsResponse.data.content || []);

        // 최신 채용공고 가져오기
        const jobsResponse = await axios.get('http://localhost:8080/api/jobs?page=0&size=2');
        setRecentJobs(jobsResponse.data.content || []);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.homeMain}>
        <div className={styles.mainImg}>
          <img src="img/main-img.png" alt="img"></img>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">New.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* STUDY 카드 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <Link to="/board" className="inline-block">
                  <div className="bg-purple-800 text-white text-lg font-semibold px-4 py-2 rounded-lg inline-block mb-6 hover:bg-purple-900 transition-colors duration-200">
                    #STUDY
                  </div>
                </Link>
                <div className="space-y-4">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post, index) => (
                      <Link to={`/post/${post.id}`} key={index} className="block group">
                        <div className="hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                          <h3 className="text-gray-900 font-medium group-hover:text-purple-800 transition-colors duration-200">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">등록된 게시글이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>

            {/* COMPETITION 카드 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <Link to="/competition" className="inline-block">
                  <div className="bg-purple-800 text-white text-lg font-semibold px-4 py-2 rounded-lg inline-block mb-6 hover:bg-purple-900 transition-colors duration-200">
                    #COMPETITION
                  </div>
                </Link>
                <div className="space-y-4">
                  {recentCompetitions.length > 0 ? (
                    recentCompetitions.map((competition, index) => (
                      <Link to={`/competition/${competition.id}`} key={index} className="block group">
                        <div className="hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                          <h3 className="text-gray-900 font-medium group-hover:text-purple-800 transition-colors duration-200">
                            {competition.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{competition.period}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">등록된 공모전이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>

            {/* JOB POSTING 카드 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <Link to="/jobposting" className="inline-block">
                  <div className="bg-purple-800 text-white text-lg font-semibold px-4 py-2 rounded-lg inline-block mb-6 hover:bg-purple-900 transition-colors duration-200">
                    #JOB POSTING
                  </div>
                </Link>
                <div className="space-y-4">
                  {recentJobs.length > 0 ? (
                    recentJobs.map((job, index) => (
                      <Link to={`/jobposting/${job.id}`} key={index} className="block group">
                        <div className="hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                          <h3 className="text-gray-900 font-medium group-hover:text-purple-800 transition-colors duration-200">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">등록된 채용공고가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Main;
