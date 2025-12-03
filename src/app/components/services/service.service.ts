import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface LightingService {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  pricing: {
    basic: {
      name: string;
      price: string;
      description: string;
    };
    standard: {
      name: string;
      price: string;
      description: string;
    };
    premium: {
      name: string;
      price: string;
      description: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private dataUrl = 'assets/data/Chic_Lighting_and_Design.json';
  private servicesData: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  private getData(): Observable<any> {
    if (!this.servicesData) {
      this.servicesData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching services data', error);
          return throwError('Failed to load services data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.servicesData;
  }

  getAllServices(): Observable<LightingService[]> {
    return this.getData().pipe(map(data => data.services));
  }

  getServiceById(serviceId: string): Observable<LightingService> {
    return this.getData().pipe(
      map(data => {
        const service = data.services.find((s: LightingService) => s.id === serviceId);
        if (!service) {
          throw new Error(`Service with ID ${serviceId} not found`);
        }
        return service;
      }),
      catchError(error => {
        console.error('Error getting service by ID', error);
        return throwError(error);
      })
    );
  }

  getServicePricing(serviceId: string): Observable<any> {
    return this.getServiceById(serviceId).pipe(map(service => service.pricing));
  }

  getServiceFeatures(serviceId: string): Observable<string[]> {
    return this.getServiceById(serviceId).pipe(map(service => service.features));
  }

  // Ví dụ helper theo id trong JSON mới
  getLightingDesignService(): Observable<LightingService | null> {
    return this.getData().pipe(
      map(data => data.services.find((s: LightingService) => s.id === 'lighting-design') || null)
    );
  }

  getProjectSupplyService(): Observable<LightingService | null> {
    return this.getData().pipe(
      map(data => data.services.find((s: LightingService) => s.id === 'project-supply') || null)
    );
  }

  getInstallationMaintenanceService(): Observable<LightingService | null> {
    return this.getData().pipe(
      map(data => data.services.find((s: LightingService) => s.id === 'installation-maintenance') || null)
    );
  }
}
