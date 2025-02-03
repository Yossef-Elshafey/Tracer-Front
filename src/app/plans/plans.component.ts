import { Component, OnInit } from '@angular/core';
import { PlansService } from '../services/plans.service';
import { Plan } from '../types/interface';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { Caller } from '../common/caller';
import { PopupComponent } from '../popup/popup.component';
import { PopupEnum } from '../types/enums/PopupEnum';
import { PopupStatusService } from '../services/popup-status.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, CalendarComponent, PopupComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})
export class PlansComponent implements OnInit {
  constructor(
    private planService: PlansService,
    private caller: Caller,
    private popupService: PopupStatusService,
  ) {}

  plans = [] as Plan[];
  singlePlan = {} as Plan;
  plansEndAt: string[] = [];
  serverState = '';
  clickedDay = '';
  storeOriginalPercentage: number | null = null;
  inputHolded = false;
  popupEnum = PopupEnum;
  displaySinglePlan = false;

  ngOnInit(): void {
    this.planService.fetchPlans().subscribe();
    this.planService.$plans.subscribe((plans) => {
      this.plans = plans;
      this.endAt();
    });

    this.caller.$state.subscribe((state) => {
      this.serverState = state;
    });
  }

  endAt() {
    this.plansEndAt = this.plans.map((obj) => obj.finish_by);
  }

  returnToAllPlans() {
    this.inputHolded = false;
    this.displaySinglePlan = false;
    this.clickedDay = '';
  }

  captureNewDayClicked(e: string) {
    this.returnToAllPlans();
    // restore orignal progress when switching between calendar days
    if (this.singlePlan.id && this.storeOriginalPercentage) {
      this.singlePlan.progress = this.storeOriginalPercentage;
      this.singlePlan = {} as Plan;
      this.storeOriginalPercentage = null;
    }

    this.clickedDay = e;
  }

  displayAsDate(dte: string) {
    return new Date(dte).toDateString();
  }

  baseCompare(key: keyof Pick<Plan, 'finish_by' | 'added'>) {
    const target = this.plans.findIndex((obj) => {
      const planDate = new Date(obj[key]);

      if (this.clickedDay) {
        const date = new Date(this.clickedDay);
        return (
          date.getFullYear() === planDate.getFullYear() &&
          date.getMonth() === planDate.getMonth() &&
          date.getDate() === planDate.getDate()
        );
      }

      return false;
    });

    return {
      founded: target !== -1,
      plan: this.plans[target],
    };
  }

  saveOrginalPercentage(orig: number) {
    if (!this.storeOriginalPercentage) {
      this.storeOriginalPercentage = orig;
    }
  }

  isDateStartOfPlan() {
    const target = this.baseCompare('added');
    if (target.founded) {
      this.singlePlan = target.plan;
    }

    return target.founded;
  }

  isDateEndOfPlan() {
    const target = this.baseCompare('finish_by');
    if (target.founded) {
      this.singlePlan = target.plan;
    }

    return target.founded;
  }

  handleHold(e: Event) {
    this.inputHolded = true;
    const ele = e.currentTarget as HTMLInputElement;
    const val = ele.value;
    // capture the original progress to return it back if no chagnes done
    this.saveOrginalPercentage(this.singlePlan.progress);
    this.singlePlan.progress = Math.trunc((+val / this.singlePlan.steps) * 100);
  }

  updateProgress() {
    const newProg = {
      progress: this.singlePlan.steps * (this.singlePlan.progress / 100),
    };

    this.planService.updatePlanProgress(`plan/${this.singlePlan.id}`, newProg);
    this.popupService.show(this.popupEnum.SUCCESS);
    this.storeOriginalPercentage = null;
  }

  displayTargetPlan(plan: Plan) {
    this.singlePlan = plan;
    this.displaySinglePlan = true;
  }

  addPlan() {
    this.popupService.show(this.popupEnum.ADD_PLAN);
  }

  async setPlan(title: string, steps: string, finishBy: string) {
    const oldLen = this.plans.length;
    const payload = { plan: title, steps: +steps, finish_by: finishBy };

    if (steps) {
      await this.planService.post('plan', payload);
    }
    this.popupService.remove(this.popupEnum.ADD_PLAN);
    const newLen = this.plans.length;

    // new marks should be added if new plan
    if (oldLen !== newLen) {
      this.endAt();
    }
  }

  preDeletePlan() {
    this.popupService.show(this.popupEnum.DELETE_PLAN);
  }

  deletePlan(id: number) {
    this.planService.delete(id);
    this.popupService.remove(this.popupEnum.DELETE_PLAN);
    this.singlePlan = {} as Plan;
  }
}
