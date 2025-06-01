import { Injectable, TemplateRef } from "@angular/core";
import { ToastInfo } from "../../../pages/admin/models/common.model";

@Injectable({ providedIn: 'root' })
export class AlertService {
    toasts: ToastInfo[] = [];

    show(toast: ToastInfo) {
        this.toasts.push(toast);
    }

    remove(toast: ToastInfo) {
        this.toasts = this.toasts.filter(t => t != toast);
    }

    clear() {
        this.toasts.splice(0, this.toasts.length);
    }

	showSuccess(toast: ToastInfo) {
		this.show({ ...toast, classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(toast: ToastInfo) {
		this.show({ ...toast, classname: 'bg-danger text-light', delay: 15000 });
	}
}