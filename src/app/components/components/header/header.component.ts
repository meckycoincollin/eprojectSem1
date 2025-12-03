import { Component, OnInit } from '@angular/core';
import { CompanyService, Company, Statistics } from 'src/app/components/services/company.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  companyInfo: Company | null = null;
  statistics: Statistics | null = null;

  isDropdownOpen = false;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.companyService.getCompanyInfo().subscribe({
      next: (c) => this.companyInfo = c
    });

    this.companyService.getStatistics().subscribe({
      next: (s) => this.statistics = s
    });
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
