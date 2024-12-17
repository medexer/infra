import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResult {
  @ApiProperty()
  url: string;
  @ApiProperty()
  public_id: string;
}
