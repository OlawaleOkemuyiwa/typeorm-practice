export default interface ClientInterface {
  pin: string;
  card_number: string;
  balance: number;
  is_active: boolean;
  additional_info: {
    age: number,
    hair_color: string
  }
  family_members: string[];
  created_at: Date;
  updated_at: Date;
} 