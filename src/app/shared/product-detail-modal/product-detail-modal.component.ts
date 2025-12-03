// product-detail-modal.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Product } from 'src/app/components/services/products.service';

declare var $: any;

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss']
})
export class ProductDetailModalComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() category: any = null;
  @Input() relatedProducts: Product[] = [];
  @Input() loading: boolean = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() viewRelatedProduct = new EventEmitter<Product>();

  activeImageIndex: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void { }

  show(): void {
    $('#productDetailModal').modal('show');
    setTimeout(() => {
      this.initializeModalComponents();
    }, 200);
  }

  hide(): void {
    $('#productDetailModal').modal('hide');
    this.closeModal.emit();
  }

  goToContact(): void {
    this.hide();
    this.router.navigate(['/contact']);
  }

  changeImage(index: number): void {
    this.activeImageIndex = index;
  }

  viewRelated(product: Product): void {
    this.viewRelatedProduct.emit(product);
  }

  private initializeModalComponents(): void {
    $('.modal-product-gallery .gallery-item').on('click', function () {
      $('.modal-product-gallery .gallery-item').removeClass('active');
      $(this).addClass('active');
    });
  }

  getDiscountedPrice(price: number, discount: number | null): number {
    if (discount) {
      return price * (1 - discount / 100);
    }
    return price;
  }

  getSanitizedDescription() {
    if (this.product && this.product.description) {
      return this.sanitizer.bypassSecurityTrustHtml(this.product.description);
    }
    return '';
  }

  //doc download helper
  downloadProductDoc(): void {
    if (!this.product) { return; }

    const p = this.product;

    const html = `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <h1>${p.name}</h1>
        <p><b>Brand:</b> ${p.brandId}</p>
        <p><b>Category:</b> ${p.categoryId}</p>
        <p><b>Price:</b> $${p.price}</p>
        ${p.discount ? `<p><b>Discount:</b> ${p.discount}%</p>` : ''}
        <h3>Description</h3>
        <p>${p.description}</p>
        <h3>Features</h3>
        <ul>
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </body>
    </html>
  `;

    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.id}-datasheet.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
