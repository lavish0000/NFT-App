import { getMockReq, getMockRes } from '@jest-mock/express';

import { createTask, updateTask, getAllTasks } from '../controller';

jest.mock('../services', () => ({
  addTaskService: jest.fn().mockImplementation(() =>
    Promise.resolve({
      rows: [
        {
          id: 1,
          title: 'test',
          parent_task_id: null,
          status: 'pending',
          created_at: '2020-01-01',
        },
      ],
    }),
  ),
  getAllTaskService: jest.fn().mockImplementation(() =>
    Promise.resolve({
      rows: [
        {
          id: 1,
          title: 'test',
          parent_task_id: null,
          status: 'pending',
          created_at: '2020-01-01',
        },
        {
          id: 2,
          title: 'test2',
          parent_task_id: 1,
          status: 'pending',
          created_at: '2020-01-01',
        },
      ],
    }),
  ),
  getTaskByIdService: jest.fn().mockImplementation(() =>
    Promise.resolve({
      rows: [
        {
          id: 1,
          title: 'test',
          parent_task_id: null,
          status: 'pending',
          created_at: '2020-01-01',
        },
      ],
      rowCount: 1,
    }),
  ),
  updateTaskByIdService: jest.fn().mockImplementation(() =>
    Promise.resolve({
      rows: [
        {
          id: 1,
          title: 'test',
          parent_task_id: null,
          status: 'completed',
          created_at: '2020-01-01',
        },
      ],
    }),
  ),
  updateSubTasksStatusByParentIdService: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ rows: [] })),
  getSubTaskService: jest.fn().mockImplementation(() =>
    Promise.resolve({
      rows: [
        {
          id: 4,
          title: 'subtest',
          parent_task_id: 1,
          status: 'pending',
          created_at: '2020-01-01',
        },
        {
          id: 5,
          title: 'subtest2',
          parent_task_id: 1,
          status: 'pending',
          created_at: '2020-01-01',
        },
      ],
      rowCount: 2,
    }),
  ),
}));

describe('Task controllers test', () => {
  it('create task', async () => {
    const req = getMockReq({
      body: {
        title: 'test',
        parent_task_id: null,
      },
    });
    const { res } = getMockRes();

    await createTask(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        title: 'test',
        parent_task_id: null,
        status: 'pending',
        id: 1,
        created_at: '2020-01-01',
      },
      error: null,
      message: 'success',
      status: 200,
    });
  });

  it('update task', async () => {
    const req = getMockReq({
      body: {
        id: 1,
        status: 'completed',
      },
    });
    const { res } = getMockRes();

    await updateTask(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        updatedParentTask: {},
        updatedSubTasks: [
          {
            id: 4,
            title: 'subtest',
            parent_task_id: 1,
            status: 'completed',
            created_at: '2020-01-01',
          },
          {
            id: 5,
            title: 'subtest2',
            parent_task_id: 1,
            status: 'completed',
            created_at: '2020-01-01',
          },
        ],
        updatedTask: {
          id: 1,
          title: 'test',
          parent_task_id: null,
          status: 'completed',
          created_at: '2020-01-01',
        },
      },
      error: null,
      message: 'success',
      status: 200,
    });
  });

  it('get all task', async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await getAllTasks(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: null,
      message: 'success',
      status: 200,
      data: [
        {
          created_at: '2020-01-01',
          id: 1,
          parent_task_id: null,
          status: 'pending',
          title: 'test',
          sub_tasks: [
            {
              created_at: '2020-01-01',
              id: 2,
              parent_task_id: 1,
              status: 'pending',
              title: 'test2',
            },
          ],
        },
      ],
    });
  });
});
