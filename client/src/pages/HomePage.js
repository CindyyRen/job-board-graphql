// import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
// import { getJobs } from '../lib/graphql/queries';
import { useJobs } from '../lib/graphql/hooks';

// getJobs().then((jobs) => console.log('jobs:', jobs));

function HomePage() {
  // const [jobs, setJobs] = useState([]);
  // useEffect(() => {
  //   getJobs().then(setJobs);
  // }, []);

  // console.log('[HomePage] jobs:', jobs);
  const { jobs, loading, error } = useJobs();
  console.log('[HomePage]', { jobs, loading, error });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
