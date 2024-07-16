import { Elysia, t } from 'elysia';

import { TranslateRequest, TranslateResponse } from '../types/translate';
import { translate } from '../controllers/translate';
// import { loggedMemberOnly } from '../../plugins/auth';

export const router = () => new Elysia()
    // .use(loggedMemberOnly())
    .post(
        '/api/translate',
        async ({ body }) => {
            const translations = await translate(body);

            return {
                status: true,
                data: translations,
            };
        },
        {
            body: TranslateRequest,
            response: t.Object({
                status: t.Boolean(),
                data: TranslateResponse,
            }),
        }
    );
