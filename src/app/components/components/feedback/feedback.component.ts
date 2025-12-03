import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  services: string[];
}

interface ViewerFeedback {
  name: string;
  email: string;
  topic: 'Product' | 'Store' | 'Service' | 'Website' | 'Other';
  rating: number;
  message: string;
  storeLocationId?: string;
  createdAt: Date;
  allowShare: boolean;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  submitted = false;
  loading = false;
  success = false;

  storeLocations: StoreLocation[] = [];
  companyInfo: any = {};

  // Local list to show recent feedback 
  feedbackList: ViewerFeedback[] = [];

  ratingOptions = [1, 2, 3, 4, 5];

  topics = [
    { value: 'Product', label: 'Product quality & design' },
    { value: 'Service', label: 'Consultation / installation service' },
    { value: 'Store', label: 'Store experience & staff' },
    { value: 'Website', label: 'Website & online experience' },
    { value: 'Other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      topic: ['Product', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      storeLocationId: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
      allowShare: [true] // viewer allows us to show feedback publicly
    });
  }

  ngOnInit(): void {
    this.loadBaseData();
  }

  loadBaseData(): void {
    this.dataService.getContactPageData().subscribe({
      next: (data) => {
        this.storeLocations = data.storeLocations || [];
        this.companyInfo = data.company || {};
      },
      error: (err) => {
        console.error('Error loading feedback base data:', err);
      }
    });
  }

  get f() {
    return this.feedbackForm.controls;
  }

  getFieldClass(fieldName: string) {
    const field = this.feedbackForm.get(fieldName);
    return {
      'is-invalid': field?.invalid && (field.dirty || field.touched || this.submitted),
      'is-valid': field?.valid && (field.dirty || field.touched)
    };
  }

  setRating(value: number): void {
    this.feedbackForm.patchValue({ rating: value });
  }

  onSubmit(): void {

    this.submitted = true;

    if (this.feedbackForm.invalid) {
      return;
    }

    this.loading = true;

    // Fake "submit" – in real project you would POST to backend
    setTimeout(() => {
      const formValue = this.feedbackForm.value;

      const newFeedback: ViewerFeedback = {
        name: formValue.name,
        email: formValue.email,
        topic: formValue.topic,
        rating: formValue.rating,
        message: formValue.message,
        storeLocationId: formValue.storeLocationId || undefined,
        createdAt: new Date(),
        allowShare: formValue.allowShare
      };

      // Add to local list (top) only if user allows sharing
      if (formValue.allowShare) {
        this.feedbackList = [newFeedback, ...this.feedbackList];
      }

      this.success = true;
      this.loading = false;
      this.resetFormAfterSubmit();
    }, 1000);
  }

  resetFormAfterSubmit(): void {
    this.submitted = false;
    this.feedbackForm.reset({
      topic: 'Product',
      rating: 5,
      storeLocationId: '',
      allowShare: true
    });
  }

  getStoreNameById(id?: string): string | null {
    if (!id) return null;
    const store = this.storeLocations.find(s => s.id === id);
    return store ? store.name : null;
  }
}
