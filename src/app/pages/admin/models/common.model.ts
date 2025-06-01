import { TemplateRef } from "@angular/core";
import { NotiType } from "../../../shared/constants/constants";

export interface StatCard {
    title: string;
    value: number;
    icon: string;
    color: string;
    increase: number;
    link: string;
}

export interface RecentMovie {
    id: number;
    name: string;
    thumbnail: string;
    status: string;
    views: number;
    date: Date;
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string | string[];
        borderColor: string | string[];
        borderWidth: number;
    }[];
}

// Định nghĩa kiểu Status
export type Status = 'active' | 'inactive';

// Định nghĩa cấu trúc phản hồi API
export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// Định nghĩa cấu trúc phản hồi phân trang
export interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PageFilter {
    page: number;
    limit: number;
    sort: string;
  }
  
  export interface BaseResponse {
    data?: any;
    message: string;
    status: string;
  }
  
  export interface ErrorRespone {
    error: BaseResponse;
    status: number;
    url: string;
  }
  
  export interface CommonField {
    id: number | null;
    status: number; //trạng thái tham số
    isActive: number; //trạng thái hoạt động
    isDisplay: number; // ON/OFF
    newData?: string; // dữ liệu lưu nháp
    effectiveDate?: Date | string; // ngày hiệu lực
    endEffectiveDate?: Date | string; // ngày hết hiệu lực
  }
  
  export interface CommonFilterField {
    status?: string | null;
    isActive?: string | null;
    isDisplay?: string | null;
    newData?: string | null;
    effectiveDate?: string | null;
    endEffectiveDate?: string | null;
    page: number;
    limit: number;
    sort?: string;
  }
  
  export interface UserLog {
    id?: number;
    trangThaiPMH?: string;
    thoiGianThaoTac?: Date;
    userXuLy?: string;
    chucNang?: string;
    trangThaiThuCong?: string;
    trangThaiKenhTT?: string;
    instrRef?: string;
    ip?: string;
    pmhId?: string;
    thaoTac?: string;
  }
  
  export interface NotificationData {
    title: string;
    content: string;
    status: NotiType;
    isShowBtn: boolean;
    id?: number;
    completed?: boolean;
    data?: any;
  }
  
  export interface Pagable {
    itemPerpage: number;
    currentPage: number;
    totalItems?: number;
  }
  
  export interface Option {
    value: string;
    label: string;
  }
  
  export interface RejectData {
    ids: string;
    lyDoTuChoi: string;
  }
  
  export interface BaseSearchFilter {
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
  }
  
  export interface TreeNode {
    readonly children?: readonly TreeNode[];
    readonly text: string;
    readonly id?: number;
    readonly order?: number;
  }
  
  export interface BreadcrumbItem {
    caption: string;
    routerLink: string;
    routerLinkActiveOptions?: any,
  }

  export interface ToastInfo {
    header: string;
    body: string;
    template?: TemplateRef<any>;
    classname?: string;
	delay?: number;
  }