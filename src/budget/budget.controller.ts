import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BudgetService } from './budget.service';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }

  @Get(':year')
  findYearBudger(@Param('year') year: number) {
    return this.budgetService.findYearBudger(year);
  }

}
