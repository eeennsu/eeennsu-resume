import octokit, { OWNER, REPO } from '@shared/api/octokit';
import { DEFAULT_BRANCH } from '@shared/consts/commons';

const apiGetBranchCommitDate = async () => {
  const branchResponse = await octokit.repos.getBranch({
    owner: OWNER,
    repo: REPO,
    branch: DEFAULT_BRANCH,
  });

  return branchResponse?.data?.commit?.commit?.author?.date ?? '';
};

export default apiGetBranchCommitDate;
