// import { GraphQLClient, gql } from 'graphql-request';
import { getAccessToken } from '../auth';
import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from '@apollo/client';
// import { GraphQLClient } from 'graphql-request';

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` };
//     }
//     return {};
//   },
// });
const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation); //将修改后的操作传递给链中的下一个链接
});
export const apolloClient = new ApolloClient({
  // uri: 'http://localhost:9000/graphql',
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const jobsQuery = gql`
  query Jobs {
    jobs {
      id
      date
      title
      company {
        id
        name
      }
    }
  }
`;

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

// export async function getJobs() {
//   const query = gql`
//     query Jobs {
//       jobs {
//         id
//         date
//         title
//         company {
//           id
//           name
//         }
//       }
//     }
//   `;
// const { jobs } = await client.request(query);
// return jobs;
//   const { data } = await apolloClient.query({
//     query,
//     fetchPolicy: 'network-only',
//   });
//   return data.jobs;
// }

// export async function getJob(id) {
// const query = gql`
//   query JobById($id: ID!) {
//     job(id: $id) {
//       id
//       date
//       title
//       company {
//         id
//         name
//       }
//       description
//     }
//   }
// `;
// const { job } = await client.request(query, { id });
// return job;
//   const { data } = await apolloClient.query({
//     query: jobByIdQuery,
//     variables: { id },
//   });
//   return data.job;
// }

// export async function getCompany(id) {
//   const query = gql`
//     query CompanyById($id: ID!) {
//       company(id: $id) {
//         id
//         name
//         description
//         jobs {
//           id
//           date
//           title
//         }
//       }
//     }
//   `;
// const { company } = await client.request(query, { id });
// return company;
//   const { data } = await apolloClient.query({
//     query,
//     variables: { id },
//   });
//   return data.company;
// }
// export async function createJob({ title, description }) {
//   const mutation = gql`
//     mutation CreateJob($input: CreateJobInput!) {
//       job: createJob(input: $input) {
//         ...JobDetail
//       }
//     }
//     ${jobDetailFragment}
//   `;
//   const { data } = await apolloClient.mutate({
//     mutation,
//     variables: { input: { title, description } },
//     update: (cache, { data }) => {
//       //这个data是mutation的返回值
//       cache.writeQuery({
//         query: jobByIdQuery,
//         variables: { id: data.job.id },
//         data,
//       });
//     },
//   });
//   return data.job;
// }
