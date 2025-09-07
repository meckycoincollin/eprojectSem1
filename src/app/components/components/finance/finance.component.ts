import { Component, OnInit } from '@angular/core';

interface CarModel {
  brand: string;
  name: string;
  price: number; // USD
}

interface FinancePlan {
  partner: string;
  apr: number;
  minDownPercent: number;
  terms: number[];
  processingFee?: number;
  notes?: string;
}

interface CalcForm {
  price: number;
  downPercent: number;
  apr: number;
  termMonths: number;
}

interface CalcResult {
  principal: number;
  downPayment: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  // CAR DATA
  brands: string[] = ['BMW', 'Audi'];

  models: CarModel[] = [
    { brand: 'BMW', name: 'BMW M8 Competition Gran Coupé', price: 165000 },
    { brand: 'BMW', name: 'BMW M4 CSL', price: 149000 },
    { brand: 'Audi', name: 'Audi RS 7 Performance', price: 145500 },
    { brand: 'Audi', name: 'Audi R8 V10 RWD', price: 205000 }
  ];

  // PLANS
  financePlans: FinancePlan[] = [
    { partner: 'Carrio Finance', apr: 6.9,  minDownPercent: 10, terms: [24, 36, 48, 60], processingFee: 199, notes: 'Flexible repayment, early closure allowed.' },
    { partner: 'City Bank',      apr: 7.5,  minDownPercent: 15, terms: [36, 48, 60, 72], processingFee: 249, notes: 'Best choice for long term loans (up to 72 months).' },
    { partner: 'Metro Credit Union', apr: 5.95, minDownPercent: 20, terms: [24, 36, 48, 60], notes: 'Lowest APR with higher down payment.' },
    { partner: 'AutoPartner Co.', apr: 8.9,  minDownPercent: 0,  terms: [12, 24, 36], processingFee: 149, notes: '0% down available for short terms only.' }
  ];

  // STATE
  selectedBrand: string = this.brands[0];
  brandModels: CarModel[] = [];
  selectedModel!: CarModel;

  // plan/term đang chọn (để highlight và tính)
  selectedPlanPartner: string | null = null;
  selectedTerm: number | null = null;

  form: CalcForm = { price: 0, downPercent: 20, apr: 6.9, termMonths: 60 };
  results: CalcResult | null = null;

  ngOnInit(): void {
    this.onBrandChange(this.selectedBrand);
  }

  // Brand / Model
  onBrandChange(brand: string) {
    this.selectedBrand = brand;
    this.brandModels = this.models.filter(m => m.brand === brand);
    this.selectedModel = this.brandModels[0];
    this.applyModelPrice();

    // reset lựa chọn plan/term khi đổi xe
    this.selectedPlanPartner = null;
    this.selectedTerm = null;
  }

  onModelChange(modelName: string) {
    const found = this.brandModels.find(m => m.name === modelName);
    if (found) {
      this.selectedModel = found;
      this.applyModelPrice();
      this.selectedPlanPartner = null;
      this.selectedTerm = null;
    }
  }

  applyModelPrice() {
    this.form.price = this.selectedModel.price;
    this.calculate();
  }

  // Chọn cả plan (nút "Use this plan")
  selectPlan(plan: FinancePlan) {
    this.selectedPlanPartner = plan.partner;
    // giữ term hiện tại nếu hợp lệ, nếu không chọn gần nhất
    const term = plan.terms.includes(this.form.termMonths)
      ? this.form.termMonths
      : this.closest(plan.terms, this.form.termMonths);
    this.applyPlan(plan, term);
  }

  // Chọn term trong plan (chip)
  selectTerm(plan: FinancePlan, term: number) {
    this.selectedPlanPartner = plan.partner;
    this.selectedTerm = term;
    this.applyPlan(plan, term);
  }

  // Áp plan + term vào form
  private applyPlan(plan: FinancePlan, term: number) {
    this.form.apr = plan.apr;
    this.form.downPercent = Math.max(this.form.downPercent, plan.minDownPercent);
    this.form.termMonths = term;
    this.selectedTerm = term;
    this.calculate();
  }

  // Hàm cũ vẫn giữ nếu bạn muốn gọi trực tiếp
  usePlan(plan: FinancePlan, term?: number) {
    const chosenTerm = term ?? this.closest(plan.terms, this.form.termMonths);
    this.selectTerm(plan, chosenTerm);
  }

  closest(arr: number[], target: number): number {
    return arr.reduce((a, b) => Math.abs(b - target) < Math.abs(a - target) ? b : a);
  }

  // Calculator
  calculate() {
    const P0 = this.form.price;
    const dp = Math.min(Math.max(this.form.downPercent, 0), 90);
    const downPayment = P0 * dp / 100;
    const principal = Math.max(P0 - downPayment, 0);
    const n = Math.max(Math.floor(this.form.termMonths), 1);
    const rMonthly = (this.form.apr / 100) / 12;

    let monthly = 0;
    if (rMonthly === 0) {
      monthly = principal / n;
    } else {
      monthly = principal * rMonthly / (1 - Math.pow(1 + rMonthly, -n));
    }

    const totalPayment = monthly * n;
    const totalInterest = totalPayment - principal;

    this.results = {
      principal,
      downPayment,
      monthlyPayment: monthly,
      totalPayment,
      totalInterest
    };
  }
}
