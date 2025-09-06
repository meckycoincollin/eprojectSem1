import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

interface Car {
  id: number;
  name: string;
  brand: string;
  images: string[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',

})
export class GalleryComponent implements OnInit {
  cars: Car[] = [];
  brands: string[] = [];
  selectedBrand: string = 'all';
  _albums: any[] = [];
  filteredCars: Car[] = [];  
  pagedCars: Car[] = [];      

  itemsPerPage = 8;
  currentPage = 1;
  totalPages = 0;

  constructor(private lightbox: Lightbox) {}

  ngOnInit(): void {
    // dữ liệu fix cứng
    this.cars = [
      { id: 1, name: 'Toyota Camry', brand: 'Toyota', images: ['assets/images/products/audi-pb18-1.jpg'] },
      { id: 2, name: 'Honda Civic', brand: 'Honda', images: ['assets/images/products/audi-pb18-2.jpg'] },
      { id: 3, name: 'BMW Vip', brand: 'BMW', images: ['assets/images/products/ev6-gt-1.jpg'] },
      { id: 4, name: 'Toyota Vios', brand: 'Toyota', images: ['assets/images/products/audi-r8-2.jpg'] },
      { id: 5, name: 'Audi R8', brand: 'Audi', images: ['assets/images/products/audi-r8-1.jpg'] },
      { id: 6, name: 'BMW CR-V1', brand: 'BMW', images: ['assets/images/products/bmw-m8-1.jpg'] },
      { id: 7, name: 'BMW CR-V2', brand: 'BMW', images: ['assets/images/products/bmw-m8-2.jpg'] },
      { id: 8, name: 'BMW CR-V3', brand: 'BMW', images: ['assets/images/products/bmw-m8-3.jpg'] },
      { id: 9, name: 'Elantra Sport', brand: 'Elantra', images: ['assets/images/products/elantra-n-1.jpg'] },
    ];

    this.brands = Array.from(new Set(this.cars.map(c => c.brand)));
    this.filterProducts('all');
  }

  filterProducts(brand: string): void {
    this.selectedBrand = brand;
    this.currentPage = 1;

    if (brand === 'all') {
      this.filteredCars = this.cars;
    } else {
      this.filteredCars = this.cars.filter(c => c.brand === brand);
    }

    this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
    this.updatePagedCars();
  }

updatePagedCars(): void {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;

  // Danh sách xe theo trang
  this.pagedCars = this.filteredCars.slice(start, end);

  // Build lại albums cho Lightbox
  this._albums = this.pagedCars.map(car => ({
    src: car.images[0],
    caption: car.name,
    thumb: car.images[0],
  }));
}

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedCars();
  }

  openLightbox(index: number): void {
    this.lightbox.open(this._albums, index);
  }

  closeLightbox(): void {
    this.lightbox.close();
  }
}
