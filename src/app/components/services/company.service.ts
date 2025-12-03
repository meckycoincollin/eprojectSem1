import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface Company {
  name: string;
  slogan: string;
  founded: number;
  description: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface Statistics {
  yearsInBusiness: number;
  LightServiced: number;        
  brandsAvailable: number;
  satisfiedCustomers: number;
  visitorsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private dataUrl = 'assets/data/Chic_Lighting_and_Design.json';
  private companyData: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  private getData(): Observable<any> {
    if (!this.companyData) {
      this.companyData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching company data', error);
          return throwError('Failed to load company data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.companyData;
  }

  getCompanyInfo(): Observable<Company> {
    return this.getData().pipe(map(data => data.company));
  }

  getStatistics(): Observable<Statistics> {
    return this.getData().pipe(map(data => data.statistics));
  }

  getVisitorCount(): Observable<number> {
    return this.getData().pipe(map(data => data.statistics.visitorsCount));
  }

  incrementVisitorCount(): Observable<number> {
    return this.getData().pipe(
      map(data => data.statistics.visitorsCount + 1)
    );
  }

  getFoundingYear(): Observable<number> {
    return this.getData().pipe(map(data => data.company.founded));
  }

  getYearsInBusiness(): Observable<number> {
    return this.getData().pipe(map(data => data.statistics.yearsInBusiness));
  }

  getSocialMediaLinks(): Observable<{ [key: string]: string }> {
    return this.getData().pipe(map(data => data.company.socialMedia));
  }

  getContactInfo(): Observable<{ email: string; phone: string; address: string }> {
    return this.getData().pipe(map(data => data.company.contact));
  }

  getOpeningHours(): Observable<{ weekdays: string; saturday: string; sunday: string }> {
    return this.getData().pipe(map(data => data.company.openingHours));
  }
}
