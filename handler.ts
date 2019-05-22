import { Handler } from 'aws-lambda';
import { success } from './utils/response';
export const hello: Handler = (event, context, callback) => {
    callback(null, success({
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
    }));

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

