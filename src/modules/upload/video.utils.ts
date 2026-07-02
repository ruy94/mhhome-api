import ffmpeg from 'fluent-ffmpeg';
import ffmpegStaticPath from 'ffmpeg-static';

const ffmpegPath = ffmpegStaticPath as unknown as string | null;

// QUAN TRỌNG: Thiết lập đường dẫn FFmpeg ngay đầu file
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  throw new Error('FFmpeg binary not found in ffmpeg-static');
}

export const compressVideo = (inputPath: string, outputPath: string): Promise<void> => {
  if (!ffmpegPath) {
    throw new Error('FFmpeg binary not found');
  }
  ffmpeg.setFfmpegPath(ffmpegPath);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        // ---- VIDEO ----
        '-preset medium',
        '-crf 20',
        '-profile:v high',
        '-level 4.0',
        '-movflags +faststart',
        "-vf scale=-2:'min(720,ih)'",
        '-pix_fmt yuv420p',

        // ---- AUDIO ----
        '-b:a 128k',
        '-ac 2',
        '-ar 44100',
        '-af volume=1.3',
      ])
      .on('end', () => resolve())
      .on('error', (err) => reject(err instanceof Error ? err : new Error(String(err))))
      .save(outputPath);
  });
};

/**
 * Compress video to 720p High Quality
 */
export const compressVideo720p = (inputPath: string, outputPath: string): Promise<void> => {
  if (!ffmpegPath) {
    throw new Error('FFmpeg binary not found');
  }
  ffmpeg.setFfmpegPath(ffmpegPath);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        // ---- TỐI ƯU TỐC ĐỘ & DUNG LƯỢNG ----

        // 1. Tăng tốc độ nén
        // 'veryfast' là điểm cân bằng tốt nhất cho web server.
        // Nếu vẫn thấy chậm, có thể dùng 'superfast' (nhưng file sẽ to hơn 1 chút)
        '-preset veryfast',

        // 2. Kiểm soát chất lượng & Dung lượng bằng CRF (QUAN TRỌNG NHẤT)
        // Thay vì ép -b:v 2500k, ta dùng -crf.
        // 23: Chuẩn mặc định (chất lượng cao).
        // 26-28: Chuẩn cho web/mobile (dung lượng giảm mạnh, mắt thường khó thấy khác biệt).
        '-crf 26',

        // 3. Tương thích thiết bị
        '-profile:v main',
        '-level 3.1', // 3.1 là đủ cho 720p, tương thích rộng hơn 4.0
        '-movflags +faststart', // Cho phép video chạy ngay khi chưa tải xong (streaming)

        // 4. Resize thông minh (720p)
        // scale='min(1280,iw)':-2 -> Nếu video gốc > 1280px chiều rộng thì giảm xuống.
        // Nếu video gốc nhỏ hơn thì giữ nguyên (tránh upscale làm vỡ hình và tăng dung lượng).
        // Ở đây ta dùng scale=-2:'min(720,ih)' để ưu tiên chiều cao 720p nhưng không upscale.
        "-vf scale=-2:'min(720,ih)'",

        '-pix_fmt yuv420p',

        // 5. Giới hạn Bitrate trần (Safety cap)
        // Vẫn dùng CRF là chính, nhưng chặn không cho bitrate vượt quá mức này
        // để tránh lag khi mạng yếu.
        '-maxrate 2000k',
        '-bufsize 4000k',

        // ---- AUDIO (Giữ nguyên) ----
        '-b:a 128k', // 128k là đủ chuẩn cho web video
        '-ac 2',
        '-ar 44100',
        // '-af volume=1.3', // Bỏ boost volume nếu không thực sự cần thiết để tránh rè
      ])
      .on('end', () => resolve())
      .on('error', (err) => reject(err instanceof Error ? err : new Error(String(err))))
      .save(outputPath);
  });
};

/**
 * Generate ONE thumbnail from video
 */
export const generateThumbnail = (inputPath: string, thumbnailPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err instanceof Error ? err : new Error(String(err))))
      .screenshots({
        count: 1,
        timemarks: ['3'], // capture at 3s (safe frame)
        filename: thumbnailPath.split('/').pop(),
        folder: thumbnailPath.replace(/\/[^/]+$/, ''),
        // size: '480x?',
        size: '640x?', // Thumbnail to hơn chút
      });
  });
};
