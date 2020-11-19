import { ValidationError } from 'exegesis-koa';

export const HTTP_CODES = {
  ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
};

export class RESTError extends Error {
  statusCode: number;
  description: string;
  payload: any;
  userinfo: string;
  constructor(statusCode = HTTP_CODES.ERROR, name = 'UNKNOWN_ERROR', description = null, payload?, userinfo?) {
    super(description || name);
    this.name = name;
    this.statusCode = statusCode;
    this.description = description;
    this.payload = payload;
    this.userinfo = userinfo;
  }
}

export class RESTErrorNotFound extends RESTError {
  constructor(name = 'NOT_FOUND', description = null, payload?, userinfo?) {
    super(HTTP_CODES.NOT_FOUND, name, description, payload, userinfo);
  }
}

export class RESTErrorForbidden extends RESTError {
  constructor(name = 'FORBIDDEN', description = null, payload?, userinfo?) {
    super(HTTP_CODES.FORBIDDEN, name, description, payload, userinfo);
  }
}

export class RESTErrorUnauthorized extends RESTError {
  constructor(name = 'UNAUTHORIZED', description = null, payload?, userinfo?) {
    super(HTTP_CODES.UNAUTHORIZED, name, description, payload, userinfo);
  }
}

export class RESTErrorConflict extends RESTError {
  constructor(name = 'CONFLICT', description = null, payload?, userinfo?) {
    super(HTTP_CODES.CONFLICT, name, description, payload, userinfo);
  }
}

export class RESTErrorBadRequest extends RESTError {
  constructor(name = 'BAD_REQUEST', description = null, payload?, userinfo?) {
    super(HTTP_CODES.BAD_REQUEST, name, description, payload, userinfo);
  }
}

export function handleError(
  err: Error,
): {
  status: number;
  headers: { [key: string]: string };
  body: {
    name: string;
    description: string;
    payload?: { errors: any };
    userinfo?: any;
  };
} {
  if (err instanceof ValidationError) {
    return {
      status: err.status,
      headers: { 'content-type': 'application/json' },
      body: {
        name: 'ValidationError',
        description: err.message,
        payload: { errors: err.errors },
      },
    };
  } else if (Number.isInteger((err as any).status || (err as any).statusCode)) {
    return {
      status: (err as any).status || (err as any).statusCode,
      headers: { 'content-type': 'application/json' },
      body: {
        name: err.name || 'UnknownError',
        description: (err as any).description || err.message,
        payload: (err as any).payload || undefined,
        userinfo: (err as any).userinfo,
      },
    };
  } else {
    return {
      status: 500,
      headers: { 'content-type': 'application/json' },
      body: {
        name: 'UnknownError',
        description: err.message,
      },
    };
  }
}
