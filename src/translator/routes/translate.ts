import { Elysia, t } from 'elysia';

import { TranslateRequest, TranslateResponse } from '../types/translate';
import { translate } from '../controllers/translate';
// import { loggedMemberOnly } from '../../plugins/auth';

export const router = () => new Elysia()
    // .use(loggedMemberOnly())
    .get(
        '/api/health',
        async ({ headers }) => {
            console.log(JSON.stringify(headers));
            return {
                status: true,
                data: {
                    ok: true
                }
            };
        },
        {
            response: t.Object({
                status: t.Boolean(),
                data: t.Object({
                    ok: t.Boolean(),
                }),
            }),
        }
    )
    .post(
        '/api/translate',
        async ({ body, headers }) => {
            console.log(JSON.stringify(headers));
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
