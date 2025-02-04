import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { awsConfig } from './aws.config';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    AWS.config.update({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
    });

    this.s3 = new AWS.S3();
    this.bucketName = String(awsConfig.bucketName);
  }

  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string) {
    await this.validateFile(mimeType, fileBuffer.length);

    const fileExtension = originalName.split('.').pop();
    const key = `events-image/${randomUUID()}.${fileExtension}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
    };

    await this.s3.upload(params).promise();

    return `https://${this.bucketName}.s3.${awsConfig.region}.amazonaws.com/${key}`;
  }

  private async validateFile(mimeType: string, fileSize: number) {
    const allowedMimeType = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ];
    const maxSize = 15 * 1024 * 1024; // 15 MB

    if (!allowedMimeType.includes(mimeType)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, WEBP, JPG are allowed.',
      );
    }
    if (fileSize > maxSize) {
      throw new Error('The file is too large. The maximum size is 15MB.');
    }
  }
}
