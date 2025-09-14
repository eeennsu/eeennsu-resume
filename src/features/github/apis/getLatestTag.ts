import octokit, { OWNER, REPO } from '@shared/api/octokit';

const apiGetLatestTag = async () => {
  const response = await octokit.rest.repos.listTags({
    owner: OWNER,
    repo: REPO,
    per_page: 1,
  });

  return response?.data?.at(0)?.name ?? '';
};

export default apiGetLatestTag;
