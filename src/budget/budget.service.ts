import { Injectable } from '@nestjs/common';
import { YearBudgetDto } from './dto/yearbudget.dto';
import axios from 'axios';

@Injectable()
export class BudgetService {

    async findYearBudger(year: number): Promise<YearBudgetDto> {
        const result = await axios.get(`https://year-budget-api.onrender.com/budget/${year}`, {
            headers: {
                'X-Auth-Token': 'peaxodds2024'
            }
        });
        return result.data;
    }
}