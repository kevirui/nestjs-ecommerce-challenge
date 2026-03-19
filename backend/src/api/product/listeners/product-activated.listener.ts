import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductActivatedEvent } from '../events/product-activated.event';
import { ProductDeletedEvent } from '../events/product-deleted.event';

@Injectable()
export class ProductActivatedListener {
  @OnEvent('product.activated')
  handleProductActivatedEvent(event: ProductActivatedEvent) {
    console.log(
      `[Event] Product ${event.productId} has been activated by merchant ${event.merchantId}`,
    );
  }

  @OnEvent('product.deleted')
  handleProductDeletedEvent(event: ProductDeletedEvent) {
    console.log(
      `[Event] Product ${event.productId} has been deleted. Clearing caches...`,
    );
  }
}
