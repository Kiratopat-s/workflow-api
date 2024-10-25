import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GithubService, TotalRepoCommitsResponse } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Get('/total-commits')
  GetTotalCommits(): Promise<TotalRepoCommitsResponse> {
    return this.githubService.getCommitActivity();
  }

}
