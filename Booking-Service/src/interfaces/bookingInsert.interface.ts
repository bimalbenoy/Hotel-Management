export interface BookingInsert {
  user_id: number;
  room_id: number; // Temporary, not inserted into bookings
  check_in: string;
  check_out: string;
  status: string;
}