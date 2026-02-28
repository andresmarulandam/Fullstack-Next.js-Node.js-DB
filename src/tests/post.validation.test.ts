import { postController } from '../controllers/post.controller';
import { Request, Response } from 'express';

jest.mock('../repositories/post.repository');
jest.mock('../repositories/user.repository');

describe('Post Validations', () => {
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

  it('should reject a very short title', async () => {
    req.body = {
      title: 'Hi',
      content: 'Valid content with more than 10 characters',
      author_id: 1,
    };

    await postController.create(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'The title must be at least 3 characters long',
    });
  });

  it('should reject very short content', async () => {
    req.body = {
      title: 'Valid title',
      content: 'short',
      author_id: 1,
    };

    await postController.create(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'The content must be at least 10 characters long',
    });
  });

  it('should require all fields', async () => {
    req.body = {
      title: 'Valid title',
    };

    await postController.create(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Missing required fields: title, content, author_id',
    });
  });
});
