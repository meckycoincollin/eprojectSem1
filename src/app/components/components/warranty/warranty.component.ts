import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { StoreLocation, StoreLocatorService } from '../../services/store-locator.service';


interface WarrantyPolicy {
  brand: string;
  years: number;
  km: number;
  note: string;
  extraServices: string[];
}

@Component({
  selector: 'app-store-locator',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.scss']
})
export class WarrantyComponent {
  warrantyPolicies: WarrantyPolicy[] = [
    {
      brand: 'BMW',
      years: 3,
      km: 100_000,
      note: 'Covers engine, transmission, electrical systems, and drivetrain.',
      extraServices: [
        '24/7 Roadside Assistance',
        'Free maintenance for 1 year',
        'Extended powertrain coverage options'
      ]
    },
    {
      brand: 'Audi',
      years: 5,
      km: 150_000,
      note: 'Premium extended coverage with technology support.',
      extraServices: [
        '24/7 Roadside support',
        'Complimentary software updates',
        'Battery & hybrid system warranty'
      ]
    },
    {
      brand: 'Hyundai',
      years: 2,
      km: 80_000,
      note: 'Applies to sedans and SUVs; standard coverage.',
      extraServices: [
        'Basic roadside assistance',
        'Anti-perforation (rust) warranty',
        'Free check-up within the first year'
      ]
    },
    {
      brand: 'Suzuki',
      years: 3,
      km: 100_000,
      note: 'Compact and utility vehicles with reliable coverage.',
      extraServices: [
        'Standard roadside support',
        'Rust perforation coverage',
        'Extended warranty available on request'
      ]
    },
    {
      brand: 'Kia',
      years: 5,
      km: 150_000,
      note: 'Strong value coverage across all models.',
      extraServices: [
        'Roadside assistance package',
        'Corrosion protection up to 7 years',
        'Optional extended powertrain warranty'
      ]
    }
  ];
}