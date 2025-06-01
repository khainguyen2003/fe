export interface Actor {
  id: number;
  name: string;
  avatar: string;
  birthDate?: Date;
  birthPlace?: string;
  biography: string;
  movieCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}