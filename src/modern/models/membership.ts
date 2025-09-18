export type MembershipState = "active" | "pending" | "expired";
export type MembershipPaymentMethod = "credit card" | "cash";
export type MembershipBillingInterval = "monthly" | "yearly" | "weekly";
export type MembershipPeriodState = "planned" | "issued";


export interface Membership {
    id: number;
    uuid: string;
    name: string;
    userId: number;
    recurringPrice: number;
    validFrom: Date;
    validUntil: Date;
    state: MembershipState;
    assignedBy: string;
    paymentMethod: MembershipPaymentMethod | null;
    billingInterval: MembershipBillingInterval;
    billingPeriods: number;
}

export interface MembershipPeriod {
    id: number;
    uuid: string;
    membership: number;
    start: Date;
    end: Date;
    state: MembershipPeriodState;
}

export interface MembershipData {
    membership: Membership;
    membershipPeriods: MembershipPeriod[];
}

export interface CreateMembershipData {
    name?: string;
    recurringPrice?: number;
    paymentMethod?: string;
    billingInterval?: string;
    billingPeriods?: number;
}
