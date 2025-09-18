import { Membership, MembershipPeriod, MembershipState, CreateMembershipData } from "../models/membership";
const { v4: uuidv4 } = require("uuid");

export function extractValidFromDate(validFrom?: string): Date {
    return validFrom ? new Date(validFrom) : new Date();
}

export function extractValidUntilDate(
    validFrom: Date,
    billingInterval: string,
    billingPeriods: number
): Date {
    const validUntil = new Date(validFrom);

    if (billingInterval === "monthly") {
        validUntil.setMonth(validFrom.getMonth() + billingPeriods);
    } else if (billingInterval === "yearly") {
        validUntil.setMonth(validFrom.getMonth() + billingPeriods * 12);
    } else if (billingInterval === "weekly") {
        validUntil.setDate(validFrom.getDate() + billingPeriods * 7);
    }

    return validUntil;
}

export function extractMembershipState(validFrom: Date, validUntil: Date): MembershipState {
    const now = new Date();

    if (validFrom > now) {
        return "pending";
    }
    if (validUntil < now) {
        return "expired";
    }
    return "active";
}

export function createMembership(
    data: CreateMembershipData,
    userId: number,
    membershipId: number
): Membership {
    const validFrom = extractValidFromDate();
    const validUntil = extractValidUntilDate(validFrom, data.billingInterval!, data.billingPeriods!);
    const state = extractMembershipState(validFrom, validUntil);

    return {
        id: membershipId,
        uuid: uuidv4(),
        name: data.name!,
        userId: userId,
        recurringPrice: data.recurringPrice!,
        validFrom: validFrom,
        validUntil: validUntil,
        state: state,
        assignedBy: "system", // Default value since not in original data
        paymentMethod: data.paymentMethod as any || null,
        billingInterval: data.billingInterval as any,
        billingPeriods: data.billingPeriods!,
    };
}

export function extractMembershipPeriodEndDate(
    periodStart: Date,
    billingInterval: string
): Date {
    const validUntil = new Date(periodStart);

    if (billingInterval === "monthly") {
        validUntil.setMonth(periodStart.getMonth() + 1);
    } else if (billingInterval === "yearly") {
        validUntil.setMonth(periodStart.getMonth() + 12);
    } else if (billingInterval === "weekly") {
        validUntil.setDate(periodStart.getDate() + 7);
    }

    return validUntil;
}

export function createMembershipPeriod(
    periodId: number,
    membershipId: number,
    periodStart: Date,
    billingInterval: string
): MembershipPeriod {
    const periodEnd = extractMembershipPeriodEndDate(periodStart, billingInterval);

    return {
        id: periodId,
        uuid: uuidv4(),
        membership: membershipId,
        start: periodStart,
        end: periodEnd,
        state: "planned",
    };
}
