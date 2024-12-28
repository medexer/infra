import { Get, Req, Post, Controller, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';

@ApiTags('admin')
@Controller({ path: 'admin' })
export class AdminController {
  constructor(public readonly adminService: AdminService) {}
}
