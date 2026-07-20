import jwt from 'jsonwebtoken';
import config from '../config/config';
import {Request} from 'express';

const jwtSecret = config.jwtAccessSecret;

export const getUserIdFromRequest = (req: Request): string => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Missing or invalid Authorization header');
    }

    const token = authHeader.slice(7);

    return getUserIdFromJwt(token);
    const payload = jwt.verify(token, jwtSecret) as { sub: string };
    if (!payload.sub) {
        throw new Error('JWT payload missing sub');
    }

    return payload.sub;
};

export const getUserIdFromJwt = (token: string): string => {

    const payload = jwt.verify(token, jwtSecret) as { sub: string };
    if (!payload.sub) {
        throw new Error('JWT payload missing sub');
    }

    return payload.sub;
};

export default getUserIdFromRequest;