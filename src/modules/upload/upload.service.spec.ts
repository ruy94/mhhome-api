jest.mock('file-type', () => ({ fileTypeFromFile: jest.fn() }), { virtual: true });
jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));

import { ConflictException } from '@nestjs/common';
import { UploadService } from './upload.service.js';

describe('UploadService media cleanup', () => {
  const createService = () => {
    const uploadVideoQueue = { add: jest.fn() };
    const mediaCleanupQueue = { add: jest.fn() };
    const storage = {
      uploadFile: jest.fn(),
      downloadFile: jest.fn(),
      deleteObject: jest.fn(),
    };
    const count = jest.fn().mockResolvedValue(0);
    const prisma = {
      product: { count: jest.fn().mockResolvedValue(0) },
      variant: { count },
      category: { count },
      banner: { count },
      review: { count },
      zaloVideo: { count },
    };
    const redisClient = {
      set: jest.fn().mockResolvedValue('OK'),
      exists: jest.fn().mockResolvedValue(0),
    };
    const redis = { getClient: jest.fn(() => redisClient) };

    return {
      service: new UploadService(
        uploadVideoQueue as never,
        mediaCleanupQueue as never,
        storage as never,
        prisma as never,
        redis as never,
      ),
      mediaCleanupQueue,
      storage,
      prisma,
      redisClient,
    };
  };

  it('queues an idempotent image deletion with two retries and exponential backoff', async () => {
    const { service, mediaCleanupQueue } = createService();

    await service.enqueueImageCleanup('../old-image.webp');

    expect(mediaCleanupQueue.add).toHaveBeenCalledWith(
      'delete-image',
      { filename: 'old-image.webp' },
      expect.objectContaining({
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      }),
    );
  });

  it('marks a video deleted before queueing its cleanup', async () => {
    const { service, mediaCleanupQueue, redisClient } = createService();

    await service.enqueueVideoCleanup('old-video.mp4');

    expect(redisClient.set).toHaveBeenCalledWith(
      'media:deleted:videos/old-video.mp4',
      '1',
      'EX',
      86400,
    );
    expect(redisClient.set.mock.invocationCallOrder[0]).toBeLessThan(
      mediaCleanupQueue.add.mock.invocationCallOrder[0],
    );
  });

  it('does not compress a video carrying a deletion tombstone', async () => {
    const { service, storage, redisClient } = createService();
    redisClient.exists.mockResolvedValue(1);

    await service.compressQueuedVideo({
      filename: 'deleted.mp4',
      videoKey: 'videos/deleted.mp4',
    });

    expect(storage.downloadFile).not.toHaveBeenCalled();
    expect(storage.uploadFile).not.toHaveBeenCalled();
  });

  it('rejects direct deletion while an image is still referenced', async () => {
    const { service, mediaCleanupQueue, prisma } = createService();
    prisma.product.count.mockResolvedValue(1);

    await expect(service.deleteImage('used.webp')).rejects.toBeInstanceOf(ConflictException);
    expect(mediaCleanupQueue.add).not.toHaveBeenCalled();
  });

  it('deletes a video and its derived thumbnail in the cleanup worker path', async () => {
    const { service, storage } = createService();

    await service.deleteVideoNow('sample.mp4');

    expect(storage.deleteObject).toHaveBeenCalledWith('videos/sample.mp4');
    expect(storage.deleteObject).toHaveBeenCalledWith('thumbnails/sample.jpg');
  });
});
