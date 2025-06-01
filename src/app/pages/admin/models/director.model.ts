import { CommonFilterField, Status } from './common.model';

export interface Director {
  id: number;
  name: string;
  avatar: string;
  birthDate?: Date;
  birthPlace?: string;
  biography: string;
  movieCount: number;
  status: Status;
  createdAt: Date;
  selected?: boolean;
}

export interface DirectorPayload {
  name: string;
  birthDate?: Date | string | null;
  birthPlace?: string;
  biography?: string;
  status: Status;
  avatar?: File | null;
}

export interface DirectorFilter extends CommonFilterField {
  search?: string;
  status?: Status;
}