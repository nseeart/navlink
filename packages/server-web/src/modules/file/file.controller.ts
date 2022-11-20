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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ensureDirSync } from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/core/decorators/user.decorator';
import { ConfigService } from '@nestjs/config';

function getFilePath() {
    const dt = new Date();
    const month = dt.getMonth() + 1;
    const date = dt.getDate();
    return join(
        'images',
        `${dt.getFullYear()}`,
        `${month < 10 ? '0' + month : month}`,
        `${date < 10 ? '0' + date : date}`,
    );
}

function getExtname(mimetype: string): string {
    const [, ext] = mimetype.split('/');
    return `.${ext}`;
}

const uploadFileRoot = resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'uploads',
);
const filePath = getFilePath();

const uploadOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const destPath = resolve(uploadFileRoot, filePath);
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
        private readonly configService: ConfigService,
    ) {
        console.log('configService', this.configService.get('STATIC_HOST'));
        console.log('configService', process.env.NODE_NEV);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', uploadOptions))
    async uploadFile(@UploadedFile() file, @User('id') userId: number) {
        const staticDomain = this.configService.get('STATIC_DOMAIN');
        const type = getFileType(file.mimetype);
        const ossfilename = join(filePath, `${file.filename}`);
        const destfilename = join(file.destination, `${file.filename}`);
        const path = join(staticDomain, ossfilename);
        console.log('ossfilename', ossfilename);
        console.log('destfilename', destfilename);
        console.log('path', path);
        // const fileRes = await this.qiniuService.putOssFile(
        //     ossfilename,
        //     destfilename,
        //     {
        //         mime: file.mimetype,
        //     },
        // );
        // console.log('fileRes', fileRes);

        const createFile = {
            authorId: userId,
            isShow: 1,
            type,
            originalname: encodeURIComponent(file.originalname),
            mimetype: file.mimetype,
            path,
            filename: file.filename,
            size: file.size,
        };
        const createRes = await this.fileService.create(createFile);
        console.log('upload == res', createRes);
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
