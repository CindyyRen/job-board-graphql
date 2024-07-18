import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from './db/jobs.js';
import { getCompany } from './db/companies.js';
import { GraphQLError } from 'graphql';
export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    // company: (_root, { id }) => getCompany(id),
    // job: (_root, { id }) => getJob(id),
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError('No Company found with id ' + id);
      }
      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError('No Job found with id ' + id);
      }
      return job;
    },
  },
  Mutation: {
    // createJob: (_root, { title, description }) => {
    // createJob: (_root, { input: { title, description } }) => {
    // createJob: (_root, { input: { title, description } }, { auth }) => {
    //   if (!auth) {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError('Missing authentication');
      }
      // const companyId = 'FjcJCHJALA4i'; // TODO set based on user
      // return createJob({ companyId, title, description });
      return createJob({ companyId: user.companyId, title, description });
    },
    // deleteJob: (_root, { id }) => deleteJob(id),

    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError('Missing authentication');
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError('No Job found with id ' + id);
      }
      return job;
    },
    // updateJob: (_root, { input: { id, title, description } }) => {
    //   return updateJob({ id, title, description });
    // },
    updateJob: async (_root, { input: { id, title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError('Missing authentication');
      }
      const job = await updateJob({ id, companyId: user.companyId, title, description });
      if (!job) {
        throw notFoundError('No Job found with id ' + id);
      }
      return job;
  },
  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
};

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  });
}
