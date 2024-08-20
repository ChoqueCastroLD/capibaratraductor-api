import jwt from '@elysiajs/jwt';
import { Elysia } from 'elysia';

import { checkMemberToken, checkToken } from '../controllers/auth/check';
import { checkOrganization } from '../controllers/organization/check';

export const loggedOptional = () => new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: Bun.env.JWT_SECRET as string,
        })
    )
    .derive({ as: 'global' }, async ({ jwt, request: { headers } }) => {
        const token = headers.get('Authorization')?.split('Bearer ')[1];
        const organizationDomain = headers.get('organization-domain');
        if (!organizationDomain) {
            throw new Error('Unauthorized, organization domain not found.');
        }
        if (!token) {
            return { logged: false };
        }
        const tokenPayload = await jwt.verify(token);
        if (!tokenPayload) {
            return { logged: false };
        }
        const organization = await checkOrganization(organizationDomain);
        if (!organization) {
            return { logged: false };
        }
        const user = await checkToken(organization.id, token);
        if (!user) {
            return { logged: false };
        }
        return { logged: true, organizationId: organization.id, token, user };
    });

export const loggedUserOnly = () => new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: Bun.env.JWT_SECRET as string,
        })
    )
    .derive({ as: 'global' }, async ({ jwt, request: { headers } }) => {
        const organizationDomain = headers.get('organization-domain');
        if (!organizationDomain) {
            throw new Error('Unauthorized, organization domain not found.');
        }
        const token = headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            throw new Error('Unauthorized, token not found.');
        }
        const tokenPayload = await jwt.verify(token);
        if (!tokenPayload) {
            throw new Error('Unauthorized, incorrect token.');
        }
        const organization = await checkOrganization(organizationDomain);
        if (!organization) {
            throw new Error('Not authorized, organization not found.');
        }
        const user = await checkToken(organization.id, token);
        if (!user) {
            throw new Error('Unauthorized, user not found.');
        }
        return { logged: true, token, organizationId: organization.id, user };
    });

export const loggedMemberOnly = () => new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: Bun.env.JWT_SECRET as string,
        })
    )
    .derive({ as: 'global' }, async ({ jwt, request: { headers } }) => {
        const organizationDomain = headers.get('organization-domain');
        if (!organizationDomain) {
            throw new Error('Unauthorized, organization domain not found.');
        }
        const token = headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            throw new Error('Not authorized, token not found.');
        }
        const tokenPayload = await jwt.verify(token);
        if (!tokenPayload) {
            throw new Error('Unauthorized, incorrect token.');
        }
        const organization = await checkOrganization(organizationDomain);
        if (!organization) {
            throw new Error('Not authorized, organization not found.');
        }
        const member = await checkMemberToken(organization.id, token);
        if (!member) {
            throw new Error('Unauthorized, not a member of the organization.');
        }
        return { logged: true, token, organizationId: organization.id, user: member.user, member };
    });
