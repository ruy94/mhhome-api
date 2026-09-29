jest.mock('../../generated/prisma/client.js', () => ({ Prisma: {} }));
jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));
jest.mock('../upload/upload.service.js', () => ({ UploadService: class {} }));
jest.mock('../marketplace/marketplace-catalog.service.js', () => ({
  MarketplaceCatalogService: class {},
}));

import { ReviewService } from './review.service.js';

describe('ReviewService media lifecycle', () => {
  const existingReview = {
    id: 1,
    productId: 10,
    customerName: 'Mai',
    customerAvatar: 'avatar.webp',
    rating: 5,
    comment: 'Good',
    image: ['old.webp'],
    videoUrl: 'old.mp4',
    videoThumbnail: 'old.jpg',
    createdAt: new Date(),
  };

  const createService = () => {
    const tx = { review: { update: jest.fn(), delete: jest.fn() } };
    const prisma = {
      review: { findUnique: jest.fn().mockResolvedValue(existingReview) },
      $transaction: jest.fn(async (callback: (client: typeof tx) => unknown) => callback(tx)),
    };
    const uploadService = {
      enqueueImageCleanup: jest.fn(),
      enqueueVideoCleanup: jest.fn(),
    };
    const marketplaceCatalog = {
      recordProductChanges: jest.fn().mockResolvedValue(undefined),
    };
    const service = new ReviewService(
      prisma as never,
      uploadService as never,
      marketplaceCatalog as never,
    );
    return { service, prisma, tx, uploadService, marketplaceCatalog };
  };

  it('clears review video fields and queues old media only after commit', async () => {
    const { service, tx, uploadService, marketplaceCatalog } = createService();
    tx.review.update.mockResolvedValue({ ...existingReview, videoUrl: null });

    await service.update(1, { videoUrl: '', videoThumbnail: '' });

    expect(tx.review.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ videoUrl: null, videoThumbnail: null }),
      }),
    );
    expect(marketplaceCatalog.recordProductChanges).toHaveBeenCalledWith(tx, [
      existingReview.productId,
    ]);
    expect(uploadService.enqueueVideoCleanup).toHaveBeenCalledWith('old.mp4');
  });

  it('does not queue old media when the database transaction fails', async () => {
    const { service, prisma, uploadService } = createService();
    prisma.$transaction.mockRejectedValue(new Error('database unavailable'));

    await expect(
      service.update(1, { image: [], videoUrl: '', videoThumbnail: '' }),
    ).rejects.toThrow('database unavailable');

    expect(uploadService.enqueueImageCleanup).not.toHaveBeenCalled();
    expect(uploadService.enqueueVideoCleanup).not.toHaveBeenCalled();
  });
});
