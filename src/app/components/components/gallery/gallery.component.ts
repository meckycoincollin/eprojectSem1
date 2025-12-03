import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { DataService } from '../../services/data.service';

interface GalleryItem {
  id: string;
  name: string;
  brandId: string;
  images: string[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'] 
})
export class GalleryComponent implements OnInit {
  items: GalleryItem[] = [];
  brands: { id: string; name: string }[] = [];
  selectedBrand: string = 'all';

  filteredItems: GalleryItem[] = [];
  pagedItems: GalleryItem[] = [];
  _albums: any[] = [];

  itemsPerPage = 8;
  currentPage = 1;
  totalPages = 0;

  constructor(
    private lightbox: Lightbox,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getProductListPageData().subscribe({
      next: (data) => {
        this.items = (data.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          brandId: p.brandId,    
          images: p.images || []
        }));

        // Lấy brands từ JSON
        this.brands = (data.brands || []).map((b: any) => ({
          id: b.id,
          name: b.name
        }));

        this.filterProducts('all');
      },
      error: (err) => {
        console.error('Error loading gallery data', err);
      }
    });
  }

  filterProducts(brandId: string): void {
    this.selectedBrand = brandId;
    this.currentPage = 1;

    if (brandId === 'all') {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.filter(i => i.brandId === brandId);
    }

    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage) || 0;
    this.updatePagedItems();
  }

  updatePagedItems(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.pagedItems = this.filteredItems.slice(start, end);

    this._albums = this.pagedItems.map(item => ({
      src: item.images && item.images[0] ? item.images[0] : 'assets/images/default-light.jpg',
      caption: item.name,
      thumb: item.images && item.images[0] ? item.images[0] : 'assets/images/default-light.jpg'
    }));
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedItems();
  }

  openLightbox(index: number): void {
    this.lightbox.open(this._albums, index);
  }

  closeLightbox(): void {
    this.lightbox.close();
  }

  getBrandName(brandId: string): string {
    const b = this.brands.find(x => x.id === brandId);
    return b?.name ?? brandId;
  }
}
