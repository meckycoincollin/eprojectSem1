import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  brandId: string;        
  categoryId: string;
  price: number;
  discount: number | null;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  images: string[];
  inStock: boolean;
  warranty: string;

  //doc dowload
  documents?: {
    label: string;   
    type: 'pdf' | 'doc' | 'docx';
    url: string;   
  }[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private dataUrl = 'assets/data/Chic_Lighting_and_Design.json';
  private productsData: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  private getData(): Observable<any> {
    if (!this.productsData) {
      this.productsData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching product data', error);
          return throwError('Failed to load product data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.productsData;
  }

  getAllProducts(): Observable<Product[]> {
    return this.getData().pipe(map(data => data.products));
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.getData().pipe(
      map(data => data.products.filter((p: Product) => p.categoryId === categoryId))
    );
  }

  getProductById(productId: string): Observable<Product> {
    return this.getData().pipe(
      map(data => {
        const product = data.products.find((p: Product) => p.id === productId);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }
        return product;
      }),
      catchError(error => {
        console.error('Error getting product by ID', error);
        return throwError(error);
      })
    );
  }

  getAllCategories(): Observable<Category[]> {
    return this.getData().pipe(map(data => data.categories));
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.getData().pipe(
      map(data => {
        const category = data.categories.find((c: Category) => c.id === categoryId);
        if (!category) {
          throw new Error(`Category with ID ${categoryId} not found`);
        }
        return category;
      }),
      catchError(error => {
        console.error('Error getting category by ID', error);
        return throwError(error);
      })
    );
  }

  getFeaturedProducts(limit: number = 6): Observable<Product[]> {
    return this.getData().pipe(
      map(data => {
        const discounted = data.products.filter((p: Product) => p.discount !== null);

        if (discounted.length >= limit) {
          return discounted.slice(0, limit);
        }

        const others = data.products
          .filter((p: Product) => p.discount === null)
          .slice(0, limit - discounted.length);

        return [...discounted, ...others];
      })
    );
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
    return this.getData().pipe(
      map(data =>
        data.products.filter((p: Product) => {
          const actualPrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
          return actualPrice >= minPrice && actualPrice <= maxPrice;
        })
      )
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return of([]);
    }
    const searchTerm = query.toLowerCase().trim();

    return this.getData().pipe(
      map(data =>
        data.products.filter((p: Product) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        )
      )
    );
  }

  getRelatedProducts(productId: string, limit: number = 4): Observable<Product[]> {
    return this.getData().pipe(
      map(data => {
        const current = data.products.find((p: Product) => p.id === productId);
        if (!current) {
          return [];
        }

        const sameCategory = data.products.filter(
          (p: Product) => p.categoryId === current.categoryId && p.id !== productId
        );

        if (sameCategory.length >= limit) {
          return sameCategory.slice(0, limit);
        }

        const sameBrand = data.products.filter(
          (p: Product) =>
            p.brandId === current.brandId &&
            p.id !== productId &&
            !sameCategory.some(c => c.id === p.id)
        );

        const related = [...sameCategory, ...sameBrand];

        if (related.length < limit) {
          const remaining = data.products
            .filter(
              (p: Product) =>
                p.id !== productId && !related.some(r => r.id === p.id)
            )
            .slice(0, limit - related.length);
          return [...related, ...remaining];
        }

        return related.slice(0, limit);
      })
    );
  }
}
