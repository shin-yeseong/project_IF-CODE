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
        <div className={styles.boxTitle}>New.</div>

        <div className={styles.box}>
          <Link to="/board" className={styles.block}>
            <div className={styles.bt}>#STUDY</div>
            <div className={styles.bb}>
              {recentPosts.length > 0 ? (
                recentPosts.map((post, index) => (
                  <Link to={`/post/${post.id}`} key={index}>
                    <div>
                      <div>{post.title}</div>
                      <div>{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div>
                  <div>등록된 게시글이 없습니다.</div>
                </div>
              )}
            </div>
          </Link>

          <Link to="/competition" className={styles.block}>
            <div className={styles.bt}>#COMPETITION</div>
            <div className={styles.bb}>
              {recentCompetitions.length > 0 ? (
                recentCompetitions.map((competition, index) => (
                  <div key={index}>
                    <div>{competition.title}</div>
                    <div>{competition.period}</div>
                  </div>
                ))
              ) : (
                <div>
                  <div>등록된 공모전이 없습니다.</div>
                </div>
              )}
            </div>
          </Link>

          <Link to="/jobposting" className={styles.block}>
            <div className={styles.bt}>#JOB POSTING</div>
            <div className={styles.bb}>
              {recentJobs.length > 0 ? (
                recentJobs.map((job, index) => (
                  <div key={index}>
                    <div>{job.company} {job.position}</div>
                    <div>{job.experience || '신입/경력'}</div>
                  </div>
                ))
              ) : (
                <div>
                  <div>등록된 채용공고가 없습니다.</div>
                </div>
              )}
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Main;
