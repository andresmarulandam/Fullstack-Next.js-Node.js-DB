import { login } from '../controllers/auth.controller';
import { Request, Response } from 'express';

jest.mock('../services/reqres.service', () => ({
  reqresService: {
    login: jest.fn(),
    getUserById: jest.fn(),
  },
}));

import { reqresService } from '../services/reqres.service';

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    req = {
      body: {},
    };

    res = {
      status: statusMock as any,
      json: jsonMock,
    };
  });

  it('You should verify that email and password are required', async () => {
    req.body = { email: 'test@test.com' };

    await login(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Email and password are required',
    });
  });

  it('You should call the service with the correct credentials', async () => {
    req.body = {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    };

    (reqresService.login as jest.Mock).mockResolvedValue({
      status: 200,
      data: { token: 'fake-token' },
    });

    await login(req as Request, res as Response);

    expect(reqresService.login).toHaveBeenCalledTimes(1);
    expect(reqresService.login).toHaveBeenCalledWith(
      'eve.holt@reqres.in',
      'cityslicka',
    );
  });
});
