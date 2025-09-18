import { CreateMembershipData } from "../models/membership";

function validateMandatoryFields(data: CreateMembershipData): string | null {
    if (!data.name || data.recurringPrice === undefined || data.recurringPrice === null) {
        return "missingMandatoryFields";
    }
    return null;
}

function validateRecurringPrice(data: CreateMembershipData): string | null {
    if (data.recurringPrice !== undefined && data.recurringPrice < 0) {
        return "negativeRecurringPrice";
    }
    return null;
}

function validateCashPaymentMethod(data: CreateMembershipData): string | null {
    if (data.recurringPrice !== undefined &&
        data.recurringPrice > 100 &&
        data.paymentMethod === "cash") {
        return "cashPriceBelow100";
    }
    return null;
}

function validateMonthlyBillingPeriods(data: CreateMembershipData): string | null {
    if (data.billingInterval === "monthly" && data.billingPeriods !== undefined) {
        if (data.billingPeriods > 12) {
            return "billingPeriodsMoreThan12Months";
        }
        if (data.billingPeriods < 6) {
            return "billingPeriodsLessThan6Months";
        }
    }
    return null;
}

function validateYearlyBillingPeriods(data: CreateMembershipData): string | null {
    if (data.billingInterval === "yearly" && data.billingPeriods !== undefined) {
        if (data.billingPeriods > 10) {
            return "billingPeriodsMoreThan10Years";
        }
        if (data.billingPeriods < 3) {
            return "billingPeriodsLessThan3Years";
        }
    }
    return null;
}

export function validateBillingInterval(data: CreateMembershipData): string | null {
    if (data.billingInterval &&
        !["monthly", "yearly", "weekly"].includes(data.billingInterval)) {
        return "invalidBillingPeriods";
    }
    return null;
}

export function validateMembershipData(data: CreateMembershipData): string | null {
    const validations = [
        validateMandatoryFields,
        validateRecurringPrice,
        validateCashPaymentMethod,
        validateBillingInterval,
        validateMonthlyBillingPeriods,
        validateYearlyBillingPeriods,
    ];

    for (const validation of validations) {
        const error = validation(data);
        if (error) {
            return error;
        }
    }

    return null;
}
