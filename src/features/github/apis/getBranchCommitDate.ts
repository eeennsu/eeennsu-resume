import octokit, { OWNER, REPO } from '@shared/api/octokit';

const apiGetBranchCommitDate = async () => {
  const branchResponse = await octokit.repos.getBranch({
    owner: OWNER,
    repo: REPO,
    branch: process.env.NODE_ENV === 'production' ? 'main' : 'dev',
  });

  return branchResponse?.data?.commit?.commit?.author?.date ?? '';
};

export default apiGetBranchCommitDate;
