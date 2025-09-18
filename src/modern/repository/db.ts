import memberships from "../../data/memberships.json"
import membershipPeriods from "../../data/membership-periods.json"
import { Membership, MembershipBillingInterval, MembershipPaymentMethod, MembershipPeriod, MembershipPeriodState, MembershipState } from "../models/membership";

/**
 * This is just an illustrative implementation and should not be used in real-world applications.
 * This is just to have something like repository layer in the application.
 */
interface Db {
    memberships: Membership[];
    membershipPeriods: MembershipPeriod[];
}

const db: Db = {
    memberships: memberships.map(v => ({
        ...v,
        state: v.state as MembershipState,
        paymentMethod: v.paymentMethod as MembershipPaymentMethod,
        billingInterval: v.billingInterval as MembershipBillingInterval,
        validFrom: new Date(v.validFrom),
        validUntil: new Date(v.validUntil),
    })),
    membershipPeriods: membershipPeriods.map(v => ({
        ...v,
        start: new Date(v.start),
        end: new Date(v.end),
        state: v.state as MembershipPeriodState,
    })),
}

export default db;