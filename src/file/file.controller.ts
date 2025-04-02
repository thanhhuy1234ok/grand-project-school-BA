import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseFilters, UploadedFile } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Public, ResponseMessage } from 'src/helpers/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/helpers/core/http-exception.filter';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Post('upload')
  @ResponseMessage('Upload Single File')
  @UseInterceptors(FileInterceptor('fileUpload'))
  @UseFilters(new HttpExceptionFilter())
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }
  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
