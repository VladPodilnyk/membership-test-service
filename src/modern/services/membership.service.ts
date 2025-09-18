import { validateMembershipData } from '../domain/validation';
import { Result, ResultF } from '../models/common';
import { MembershipData, CreateMembershipData, MembershipPeriod } from '../models/membership';
import { createMembership, createMembershipPeriod } from '../domain/domain';
import db from '../repository/db';
import { DEFAULT_USER_ID } from '../constants';

function getAll() {
    const rows = [];
    for (const membership of db.memberships) {
        const periods = db.membershipPeriods.filter((p) => p.membership === membership.id);
        rows.push({ membership, periods });
    }
    return rows;
}

function createMembershipPeriods(
    membershipId: number,
    validFrom: Date,
    billingInterval: string,
    billingPeriods: number
): MembershipPeriod[] {
    const periods: MembershipPeriod[] = [];
    let periodStart = validFrom;

    for (let i = 0; i < billingPeriods; i++) {
        const period = createMembershipPeriod(
            i + 1,
            membershipId,
            periodStart,
            billingInterval
        );
        periods.push(period);
        periodStart = period.end;
    }

    return periods;
}

function newMembership(data: CreateMembershipData): Result<MembershipData> {
    const errMessage = validateMembershipData(data);
    if (errMessage) {
        return ResultF.failure(errMessage);
    }

    const membershipId = db.memberships.length + 1;
    const membership = createMembership(data, DEFAULT_USER_ID, membershipId);

    const membershipPeriods = createMembershipPeriods(
        membershipId,
        membership.validFrom,
        membership.billingInterval,
        membership.billingPeriods
    );

    db.memberships.push(membership);
    db.membershipPeriods.push(...membershipPeriods);

    return ResultF.success({
        membership,
        membershipPeriods
    });
}

export {
    getAll,
    newMembership,
};
