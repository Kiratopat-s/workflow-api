import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

export interface TotalRepoCommitsResponse {
  fe: number;
  be: number;
  gw: number;
}

interface WeekCommitInfo {
  day: number[];
  total: number;
  week: number;
}

@Injectable()
export class GithubService {
  private readonly GITHUB_API_URL = 'https://api.github.com/repos/Kiratopat-s/<REPO_NAME>/stats/commit_activity';
  private readonly githubToken = process.env.GITHUB_TOKEN;
  private readonly logger = new Logger(GithubService.name);

  constructor(private readonly httpService: HttpService) { }

  async getCommitActivity(): Promise<TotalRepoCommitsResponse> {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${this.githubToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    };

    const repos = ['workflow-app', 'workflow-api', 'workflow-final-gateway'];
    const requests = repos.map(repo =>
      this.httpService.get<WeekCommitInfo[]>(this.GITHUB_API_URL.replace('<REPO_NAME>', repo), { headers }).toPromise()
    );

    const responses = await Promise.all(requests);


    const totalCommits = responses.map(response => {
      this.logger.debug(`Response data for repo: ${JSON.stringify(response.data)}`);
      if (Array.isArray(response.data)) {
        return response.data.reduce((acc: number, curr: WeekCommitInfo) => acc + curr.total, 0);
      } else {
        this.logger.error(`Unexpected response data format: ${JSON.stringify(response.data)}`);
        throw new Error('Unexpected response data format');
      }
    });

    return {
      fe: totalCommits[0],
      be: totalCommits[1],
      gw: totalCommits[2]
    };
  }
}