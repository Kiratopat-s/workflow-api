import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

describe('BudgetController', () => {
    let controller: BudgetController;
    let service: BudgetService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BudgetController],
            providers: [
                {
                    provide: BudgetService,
                    useValue: {
                        findYearBudger: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<BudgetController>(BudgetController);
        service = module.get<BudgetService>(BudgetService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findYearBudger', () => {
        it('should return the budget for the given year', async () => {
            const year = 2023;
            const expectedResult = { year, budget: 10000, total: 10000 };

            jest.spyOn(service, 'findYearBudger').mockResolvedValue(expectedResult);

            expect(await controller.findYearBudger(year)).toBe(expectedResult);
        });
    });
});