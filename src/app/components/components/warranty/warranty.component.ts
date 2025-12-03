import { Component } from '@angular/core';

interface WarrantyPolicy {
  brand: string;
  years: number;
  hours: number;
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
      brand: 'Philips',
      years: 3,
      hours: 25000,
      note: 'Warranty applies to most indoor LED products including flickering, dimming issues, or non-operational fixtures.',
      extraServices: [
        '1-to-1 replacement within the first 12 months (conditions apply)',
        'Basic lighting design consultation',
        'Electrical system check for bulk installation'
      ]
    },
    {
      brand: 'OSRAM',
      years: 3,
      hours: 30000,
      note: 'Focused on energy-efficient LED solutions for residential and commercial lighting.',
      extraServices: [
        'Lighting temperature & CRI consultation',
        'In-store product replacement support',
        'Project discount program for large quantities'
      ]
    },
    {
      brand: 'Artemide',
      years: 5,
      hours: 50000,
      note: 'Premium decorative and architectural lighting collections with extended warranty.',
      extraServices: [
        'High-end lighting design advisory',
        'Technical support according to official installation guidelines',
        'Replacement support for drivers and LED modules'
      ]
    },
    {
      brand: 'Delta Light',
      years: 5,
      hours: 50000,
      note: 'Architectural lighting solutions for hotels, villas, studios, and showrooms with exceptional durability.',
      extraServices: [
        'Advanced lighting layout consultation',
        'Glare & workspace lighting assessment',
        'Full coverage for LED modules and drivers during warranty'
      ]
    },
    {
      brand: 'Tom Dixon',
      years: 2,
      hours: 20000,
      note: 'Designer lighting focused on aesthetics, material finishing, and contemporary décor.',
      extraServices: [
        'Care and surface maintenance guidance',
        'Collection styling consultation',
        'Support for ordering replacement parts and accessories'
      ]
    }
  ];
}
