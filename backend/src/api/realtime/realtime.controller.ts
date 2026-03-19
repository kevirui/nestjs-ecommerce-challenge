import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('realtime')
@Controller('realtime')
export class RealtimeController {
  private readonly events$ = new Subject<any>();

  @OnEvent('**') // Listen to all events
  handleAllEvents(payload: any, event: string) {
    this.events$.next({ event, data: payload });
  }

  @Sse('sse')
  @ApiOperation({ summary: 'Stream of server events' })
  sse(): Observable<MessageEvent> {
    return this.events$.asObservable().pipe(
      map((eventData) => ({
        data: eventData.data,
        type: eventData.event,
      } as MessageEvent)),
    );
  }
}
