import { Handler } from 'aws-lambda';
//@ts-ignore
import grip from 'grip';
//@ts-ignore
import fass_grip from 'faas-grip';
import { failure400 } from './utils/response';

export const gripTest: Handler = (event, context, callback) => {
    let padding = new Array(2048);
    let body = ':' + padding.join(' ') + '\n\n';

    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Grip-Hold': 'stream',
            'Grip-Channel': 'mychannel',
            'Grip-Keep-Alive': ':\\n\\n; format=cstring; timeout=20'
        },
        body: body
    });
};

