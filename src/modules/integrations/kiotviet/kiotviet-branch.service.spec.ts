import { KiotVietBranchService } from './kiotviet-branch.service.js';

describe('KiotVietBranchService', () => {
  it('selects the only branch without an ID', async () => {
    const client = {
      getBranches: jest
        .fn()
        .mockResolvedValue({ total: 1, data: [{ id: 10, branchName: 'Main' }] }),
    };
    const service = new KiotVietBranchService({ branchId: null } as never, client as never);
    await expect(service.resolve()).resolves.toMatchObject({ id: 10 });
    await service.resolve();
    expect(client.getBranches).toHaveBeenCalledTimes(1);
  });

  it('requires a configured ID when multiple branches exist', async () => {
    const client = {
      getBranches: jest.fn().mockResolvedValue({ total: 2, data: [{ id: 10 }, { id: 20 }] }),
    };
    const service = new KiotVietBranchService({ branchId: null } as never, client as never);
    await expect(service.resolve()).rejects.toThrow('KIOTVIET_BRANCH_ID');
  });

  it('finds a configured branch on a later page', async () => {
    const client = {
      getBranches: jest
        .fn()
        .mockResolvedValueOnce({ total: 2, data: [{ id: 10, branchName: 'Main' }] })
        .mockResolvedValueOnce({ total: 2, data: [{ id: 20, branchName: 'Second' }] }),
    };
    const service = new KiotVietBranchService({ branchId: 20 } as never, client as never);
    await expect(service.resolve()).resolves.toMatchObject({ id: 20 });
  });
});
