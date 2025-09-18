import { validateMembershipData } from './validation';
import { CreateMembershipData } from '../models/membership';

describe('validateMembershipData', () => {
    describe('mandatory fields validation', () => {
        it('should return error when name is missing', () => {
            const data: CreateMembershipData = {
                recurringPrice: 50,
                billingInterval: 'monthly',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBe('missingMandatoryFields');
        });

        it('should return error when recurringPrice is missing', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                billingInterval: 'monthly',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBe('missingMandatoryFields');
        });

        it('should pass when both name and recurringPrice are present', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: 'monthly',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBeNull();
        });
    });

    describe('recurring price validation', () => {
        it('should return error when recurringPrice is negative', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: -10,
                billingInterval: 'monthly',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBe('negativeRecurringPrice');
        });

        it('should pass when recurringPrice is positive', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 0,
                billingInterval: 'monthly',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBeNull();
        });
    });

    describe('cash payment method validation', () => {
        it('should return error when price > 100 and payment method is cash', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 150,
                paymentMethod: 'cash',
                billingInterval: 'monthly',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBe('cashPriceBelow100');
        });

        it('should pass when price > 100 but payment method is not cash', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 150,
                paymentMethod: 'credit card',
                billingInterval: 'monthly',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBeNull();
        });

        it('should pass when price <= 100 and payment method is cash', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                paymentMethod: 'cash',
                billingInterval: 'monthly',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBeNull();
        });
    });

    describe('billing interval validation', () => {
        it('should return error for invalid billing interval', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: 'invalid',
                billingPeriods: 6
            };

            const result = validateMembershipData(data);
            expect(result).toBe('invalidBillingPeriods');
        });

        it('should pass for valid billing intervals', () => {
            const validIntervals = ['monthly', 'yearly', 'weekly'];

            validIntervals.forEach(interval => {
                const data: CreateMembershipData = {
                    name: 'Test Membership',
                    recurringPrice: 50,
                    billingInterval: interval,
                    billingPeriods: 6
                };

                const result = validateMembershipData(data);
                expect(result).toBeNull();
            });
        });
    });

    describe('monthly billing periods validation', () => {
        it('should return error when monthly periods > 12', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: 'monthly',
                billingPeriods: 15
            };

            const result = validateMembershipData(data);
            expect(result).toBe('billingPeriodsMoreThan12Months');
        });

        it('should return error when monthly periods < 6', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: 'monthly',
                billingPeriods: 3
            };

            const result = validateMembershipData(data);
            expect(result).toBe('billingPeriodsLessThan6Months');
        });

        it('should pass when monthly periods are between 6 and 12', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: 'monthly',
                billingPeriods: 8
            };

            const result = validateMembershipData(data);
            expect(result).toBeNull();
        });
    });

    describe('yearly billing periods validation', () => {
        it('should return error when yearly periods > 10', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: 'yearly',
                billingPeriods: 15
            };

            const result = validateMembershipData(data);
            expect(result).toBe('billingPeriodsMoreThan10Years');
        });

        it('should return error when yearly periods < 3', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: 'yearly',
                billingPeriods: 2
            };

            const result = validateMembershipData(data);
            expect(result).toBe('billingPeriodsLessThan3Years');
        });

        it('should pass when yearly periods are between 3 and 10', () => {
            const data: CreateMembershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: 'yearly',
                billingPeriods: 5
            };

            const result = validateMembershipData(data);
            expect(result).toBeNull();
        });
    });

    describe('complete valid data', () => {
        it('should pass validation for complete valid monthly membership', () => {
            const data: CreateMembershipData = {
                name: 'Premium Monthly',
                recurringPrice: 99.99,
                paymentMethod: 'credit card',
                billingInterval: 'monthly',
                billingPeriods: 12
            };

            const result = validateMembershipData(data);
            expect(result).toBeNull();
        });

        it('should pass validation for complete valid yearly membership', () => {
            const data: CreateMembershipData = {
                name: 'Premium Yearly',
                recurringPrice: 999.99,
                paymentMethod: 'credit card',
                billingInterval: 'yearly',
                billingPeriods: 3
            };

            const result = validateMembershipData(data);
            expect(result).toBeNull();
        });
    });
});
