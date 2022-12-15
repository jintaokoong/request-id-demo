import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // add trace id to request
    req.id = uuid();
    next();
  }
}
