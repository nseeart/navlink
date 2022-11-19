import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UploadedFile,
    UseInterceptors,
    Req,
    Patch,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { FileService } from './file.service';
import { OssService } from './oss.service';
import { QiniuService } from './qiniu.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ensureDirSync } from 'fs-extra';
import { Request, Response, Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { FileListQueryDto, UpdateFieldDto } from './dto/file.dto';
import { QueryTransformPipe } from '@/core/pipes/queryTransform.pipe';
import { IPaginationOptions } from '@/globals/services/base.service';
import { FileEntity } from '@/entities/file.entity';
import { User } from '@/core/decorators/user.decorator';

const md5 = require('md5');

function getFilePath() {
    const dt = new Date();
    const month = dt.getMonth() + 1;
    const day = dt.getDay();
    return join(
        'images',
        `${dt.getFullYear()}`,
        `${month < 10 ? '0' + month : month}`,
        `${day < 10 ? '0' + day : day}`,
    );
}

function getExtname(mimetype: string): string {
    const [, ext] = mimetype.split('/');
    return `.${ext}`;
}

const uploadOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const destPath = resolve(
                __dirname,
                '..',
                '..',
                '..',
                'uploads',
                'images',
            );
            console.log('destPath', destPath);
            ensureDirSync(destPath);
            cb(null, destPath);
        },
        filename: (req, file, cb) => {
            const filename = uuidv4();
            const ext = extname(file.originalname) || getExtname(file.mimetype);
            cb(null, `${filename}${ext}`);
        },
    }),
};

const fileMap = {
    1: ['image/jpeg', 'image/png'],
    2: ['image/gif'],
};

function getFileType(mimetype: string) {
    const item = Object.entries(fileMap).find(([, value]) => {
        return value.includes(mimetype);
    });
    if (item) {
        return Number(item[0]);
    }
    return 0;
}

@Controller('files')
@ApiTags('文件模块')
@ApiBearerAuth()
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly ossService: OssService,
        private readonly qiniuService: QiniuService,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', uploadOptions))
    async uploadFile(@UploadedFile() file, @User('id') userId: number) {
        console.log('file', file);
        const type = getFileType(file.mimetype);
        const filePath = getFilePath();
        const ossfilename = join(filePath, `${file.filename}`);
        const destfilename = join(file.destination, `${file.filename}`);
        console.log('ossfilename', ossfilename);
        console.log('destfilename', destfilename);
        const fileRes = await this.qiniuService.putOssFile(
            ossfilename,
            destfilename,
            {
                mime: file.mimetype,
            },
        );
        console.log('fileRes', fileRes);
        const createFile = {
            authorId: userId,
            isShow: 1,
            type,
            originalname: encodeURIComponent(file.originalname),
            mimetype: file.mimetype,
            path: `${fileRes.localhost}/${fileRes.key}`,
            filename: file.filename,
            size: file.size,
        };
        const createRes = await this.fileService.create(createFile);
        console.log('upload == res', createRes);
        // res.send(createRes);
        // res.json(createRes);
        if (createRes) {
            return createRes;
        }
    }

    @Get('upload')
    list() {
        return 'xxxx';
    }

    // @Post()
    // create(@Body() createFileDto: CreateFileDto) {
    //     return this.fileService.create(createFileDto);
    // }
}
