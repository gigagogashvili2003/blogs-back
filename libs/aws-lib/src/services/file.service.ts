import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private readonly s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') });
  constructor(private readonly configService: ConfigService) {}
  async upload(bucketName: string, fileName: string, file: Express.Multer.File) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          ContentType: file.mimetype,
          Body: file.buffer,
        }),
      );

      const fileUrl = this.getFileUrl(this.configService.getOrThrow('AWS_S3_REGION'), bucketName, fileName);
      return fileUrl;
    } catch (err) {
      throw err;
    }
  }

  getFileUrl(awsRegion: string, bucketName: string, objectKey: string): string {
    const baseUrl = `https://s3.${awsRegion}.amazonaws.com`;
    const url = `${baseUrl}/${bucketName}/${objectKey}`;
    return url;
  }
}
