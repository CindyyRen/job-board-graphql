// import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';
// import { getCompany } from '../lib/graphql/queries';
import { companyByIdQuery } from '../lib/graphql/queries';
import JobList from '../components/JobList';
import { useCompany } from '../lib/graphql/hooks';

function CompanyPage() {
  const { companyId } = useParams();
  const { company, loading, error } = useCompany(companyId);
  // const { data, loading, error } = useQuery(companyByIdQuery, {
  //   variables: { id: companyId },
  // });
  // const [company, setCompany] = useState();
  // const [state, setState] = useState({
  //   company: null,
  //   loading: true,
  //   error: false,
  // });
  // useEffect(() => {
  // getCompany(companyId).then(setCompany);
  //   (async () => {
  //     try {
  //       const company = await getCompany(companyId);
  //       setState({ company, loading: false, error: false });
  //     } catch (error) {
  //       console.log('error:', JSON.stringify(error, null, 2));
  //       setState({ company: null, loading: false, error: true });
  //     }
  //   })();
  // }, [companyId]);
  // const company = companies.find((company) => company.id === companyId);
  // console.log('[CompanyPage] company:', company);
  // if (!company) {
  //   return <div>Loading...</div>;
  // }
  // console.log('[CompanyPage] state:', state);
  // const { company, loading, error } = state;
  // console.log('[CompanyPage]', { data, loading, error });
  console.log('[CompanyPage]', { company, loading, error });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }
  // const { company } = data;
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
