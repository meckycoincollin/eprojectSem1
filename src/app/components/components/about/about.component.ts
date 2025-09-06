import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

declare var bootstrap: any; 
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  companyInfo: any = null;
  teamMembers: any[] = [];
  statistics: any = null;
  loading = true;
  error = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadAboutData();
  }

  loadAboutData(): void {
    this.dataService.getAllData().subscribe({
      next: (data) => {
        this.companyInfo = data.company;
        this.statistics = data.statistics;
        this.teamMembers = data.teamMembers;
        this.loading = false;
        console.log(data);
        
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading about data:', err);
      }
    });
  }

  ngAfterViewInit() {
    const carouselEl = document.getElementById('showroomCarousel');
    if (carouselEl) {
      new bootstrap.Carousel(carouselEl, {
        interval: 2000,   
        ride: 'carousel', 
        wrap: true        
      });
    }
  }
}