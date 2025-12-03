import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Category, Product, Brand } from './products.service';
import { Company, Statistics } from './company.service';
import { LightingService } from './service.service';  
import { TeamMember } from './teammember.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data/Chic_Lighting_and_Design.json';
  private allData: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  private getData(): Observable<any> {
    if (!this.allData) {
      this.allData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching data', error);
          return throwError('Failed to load data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.allData;
  }

  getAllData(): Observable<any> {
    return this.getData();
  }

  getSection<T>(section: string): Observable<T> {
    return this.getData().pipe(
      map(data => {
        if (!data[section]) {
          throw new Error(`Section "${section}" not found in data`);
        }
        return data[section] as T;
      }),
      catchError(error => {
        console.error(`Error getting section ${section}`, error);
        return throwError(error);
      })
    );
  }

  getHomePageData(): Observable<{
    featuredProducts: Product[];
    categories: Category[];
    company: Company;
    statistics: Statistics;
    teamMembers: TeamMember[];
  }> {
    return this.getData().pipe(
      map(data => {
        const featuredProducts = data.products.slice(0, 6);

        return {
          featuredProducts,
          categories: data.categories,
          company: data.company,
          statistics: data.statistics,
          teamMembers: data.teamMembers
        };
      })
    );
  }

  getProductListPageData(): Observable<{
    products: Product[];
    categories: Category[];
    brands: Brand[];
  }> {
    return this.getData().pipe(
      map(data => ({
        products: data.products,
        categories: data.categories,
        brands: data.brands
      }))
    );
  }

  getProductDetailPageData(productId: string): Observable<{
    product: Product;
    relatedProducts: Product[];
    category: Category;
  }> {
    return this.getData().pipe(
      map(data => {
        const product = data.products.find((p: Product) => p.id === productId);

        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        const category = data.categories.find(
          (c: Category) => c.id === product.categoryId
        );

        const relatedProducts = data.products
          .filter(
            (p: Product) =>
              p.categoryId === product.categoryId && p.id !== productId
          )
          .slice(0, 4);

        return {
          product,
          category,
          relatedProducts
        };
      }),
      catchError(error => {
        console.error('Error getting product detail data', error);
        return throwError(error);
      })
    );
  }

  getSupportPageData(): Observable<{
    services: LightingService[];
  }> {
    return this.getData().pipe(
      map(data => ({
        services: data.services     
      }))
    );
  }

  getStoreLocatorPageData(): Observable<any> {
    return this.getData();
  }

  getGalleryData(): Observable<any> {
    return this.getData();
  }

  getContactPageData(): Observable<any> {
    return this.getData();
  }
}
