import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Film,
  MapPin,
  Menu,
  Play,
  Search,
  Ticket,
  UserRound,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Movie = {
  title: string;
  genre: string;
  rating: string;
  duration: string;
  accent: string;
  image: string;
  description: string;
};

type Booking = {
  title: string;
  date: string;
  time: string;
  cinema: string;
  seats: string[];
  total: number;
  confirmationCode: string;
};

const movies: Movie[] = [
  {
    title: 'The Last Horizon',
    genre: 'Sci-fi / Drama',
    rating: '8.6',
    duration: '2h 18m',
    accent: '#bc4f38',
    image: 'https://images.pexels.com/photos/25746381/pexels-photo-25746381.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'A lone cartographer follows a signal beyond the edge of the known world.',
  },
  {
    title: 'Velvet Season',
    genre: 'Drama / Romance',
    rating: '8.2',
    duration: '1h 54m',
    accent: '#d09a52',
    image: 'https://images.pexels.com/photos/7991408/pexels-photo-7991408.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Two strangers, one winter, and a city that never tells the whole truth.',
  },
  {
    title: 'After the Lights',
    genre: 'Mystery / Thriller',
    rating: '7.9',
    duration: '2h 06m',
    accent: '#627b68',
    image: 'https://images.pexels.com/photos/7991501/pexels-photo-7991501.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'When the final reel ends, the real story starts in the empty theatre.',
  },
];

const dates = [
  { day: 'Tue', number: '14' },
  { day: 'Wed', number: '15' },
  { day: 'Thu', number: '16' },
  { day: 'Fri', number: '17' },
  { day: 'Sat', number: '18' },
];

const showtimes = ['10:30 AM', '01:15 PM', '04:40 PM', '07:20 PM', '09:55 PM'];
const occupiedSeats = new Set(['A4', 'A5', 'B2', 'B3', 'C7', 'D6', 'D7', 'E1', 'E2', 'F5', 'G4', 'G5']);
const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie>(movies[0]);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState(showtimes[3]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const filteredMovies = useMemo(
    () => movies.filter((movie) => `${movie.title} ${movie.genre}`.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const total = selectedSeats.length * 14.5;

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.has(seat)) return;
    setSelectedSeats((current) => current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat]);
  };

  const openBooking = () => {
    setBookingError('');
    setBookingOpen(true);
  };

  const submitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSeats.length) {
      setBookingError('Choose at least one seat to continue.');
      return;
    }
    setIsSubmitting(true);
    setBookingError('');
    const confirmationCode = `IM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const booking = {
      movie_title: selectedMovie.title,
      show_date: `2026-10-${selectedDate.number}`,
      show_time: selectedTime,
      cinema: 'The Grand Hall · Screen 04',
      seats: selectedSeats,
      total_amount: total,
      customer_name: customerName,
      customer_email: customerEmail,
      confirmation_code: confirmationCode,
    };
    const { error } = await supabase.from('movie_bookings').insert(booking);
    setIsSubmitting(false);
    if (error) {
      setBookingError('We couldn’t save this booking right now. Please try again.');
      return;
    }
    setConfirmation({ title: selectedMovie.title, date: selectedDate.number, time: selectedTime, cinema: booking.cinema, seats: selectedSeats, total, confirmationCode });
    setBookingOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] text-[#202522]">
      <header className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="flex items-center gap-3 text-lg font-bold tracking-[-0.03em]"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#c64f38] text-white"><Film size={18} /></span>imovies</a>
        <nav className="hidden items-center gap-9 text-sm font-medium text-[#636964] md:flex"><a className="text-[#202522]" href="#movies">Now showing</a><a href="#experience">The experience</a><a href="#about">About us</a></nav>
        <button className="hidden items-center gap-2 rounded-full border border-[#d9d6ce] px-4 py-2 text-sm font-semibold md:flex"><UserRound size={16} /> My account</button>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-[#d9d6ce] md:hidden" aria-label="Open menu"><Menu size={19} /></button>
      </header>

      <main id="top" className="mx-auto max-w-[1240px] px-6 pb-20 lg:px-10">
        <section className="relative overflow-hidden rounded-[28px] bg-[#222b26] px-7 pb-8 pt-10 text-[#faf8f2] sm:px-12 sm:pb-12 sm:pt-16 lg:min-h-[455px] lg:px-16">
          <div className="absolute -right-8 top-0 h-full w-[48%] opacity-70 lg:block"><img className="h-full w-full object-cover mix-blend-screen" src="https://images.pexels.com/photos/7991436/pexels-photo-7991436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Moody rows of cinema seats" /><div className="absolute inset-0 bg-gradient-to-r from-[#222b26] via-[#222b26]/55 to-transparent" /></div>
          <div className="relative max-w-[570px]">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e5b277]"><span className="h-px w-8 bg-[#e5b277]" /> Your seat is waiting</p>
            <h1 className="max-w-[600px] text-5xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-7xl">Movies feel better in person.</h1>
            <p className="mt-6 max-w-[470px] text-base leading-7 text-[#c4cbc4]">Find the story you want to get lost in. Browse what’s playing, choose your perfect seat, and make tonight a little more cinematic.</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href="#movies" className="inline-flex items-center gap-2 rounded-full bg-[#d86448] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e27256]">Explore movies <ArrowRight size={16} /></a><button onClick={() => setDetailsOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-[#67736c] px-5 py-3 text-sm font-bold text-[#f4f2ec] transition hover:border-[#f4f2ec]"><Play size={15} fill="currentColor" /> How it works</button></div>
          </div>
          <div className="relative mt-14 flex flex-wrap gap-8 border-t border-[#53615a] pt-5 text-xs text-[#c4cbc4] sm:absolute sm:bottom-10 sm:left-12 sm:mt-0 sm:border-0 sm:pt-0 lg:left-16"><span><strong className="mr-1 text-white">12</strong> screens</span><span><strong className="mr-1 text-white">4K</strong> projection</span><span><strong className="mr-1 text-white">Dolby</strong> Atmos sound</span></div>
        </section>

        <section id="movies" className="scroll-mt-6 pt-20">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b65a42]">Curated for you</p><h2 className="text-4xl font-semibold tracking-[-0.05em]">Now showing</h2></div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-3 text-[#737873]" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a film" className="w-full rounded-full border border-[#d8d4cc] bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#b65a42]" /></div></div>
          <div className="grid gap-5 lg:grid-cols-3">{filteredMovies.map((movie) => <button key={movie.title} onClick={() => { setSelectedMovie(movie); setSelectedSeats([]); }} className={`group text-left ${selectedMovie.title === movie.title ? 'selected-card' : ''}`}><div className="relative mb-4 aspect-[1.28/1] overflow-hidden rounded-2xl bg-[#d8d0c5]"><img src={movie.image} alt={movie.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-[#f4e9d7] px-3 py-1 text-xs font-bold" style={{ color: movie.accent }}>IMDb {movie.rating}</span><span className="absolute bottom-4 left-4 text-xs font-semibold text-white">{movie.genre} <span className="mx-1 text-white/50">·</span> {movie.duration}</span>{selectedMovie.title === movie.title && <span className="absolute bottom-4 right-4 grid h-7 w-7 place-items-center rounded-full bg-[#d86448] text-white"><Check size={15} /></span>}</div><h3 className="text-xl font-semibold tracking-[-0.03em]">{movie.title}</h3><p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6a706c]">{movie.description}</p></button>)}</div>
        </section>

        <section id="experience" className="mt-24 grid gap-10 border-t border-[#d9d6ce] pt-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b65a42]">Plan your visit</p><h2 className="max-w-sm text-4xl font-semibold leading-tight tracking-[-0.05em]">Make an evening of it.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-[#6a706c]">Select your date, find a showtime, and we’ll take care of the rest. No queues, no awkward seat shuffling.</p></div>
          <div className="rounded-2xl border border-[#d9d6ce] bg-[#faf9f6] p-5 sm:p-7"><div className="mb-7 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b817c]">Choose a date</p><p className="mt-1 font-semibold">October 2026</p></div><CalendarDays size={20} className="text-[#b65a42]" /></div><div className="grid grid-cols-5 gap-2">{dates.map((date) => <button key={date.number} onClick={() => setSelectedDate(date)} className={`rounded-xl py-3 text-center transition ${selectedDate.number === date.number ? 'bg-[#26362d] text-white' : 'bg-[#f0eee8] hover:bg-[#e5e1d8]'}`}><span className="block text-xs opacity-70">{date.day}</span><span className="mt-1 block text-lg font-semibold">{date.number}</span></button>)}</div><div className="my-7 h-px bg-[#e1ded7]" /><div className="mb-4 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b817c]">Showtimes for {selectedMovie.title}</p><span className="flex items-center gap-1 text-xs text-[#7b817c]"><Clock3 size={14} /> 2h 18m</span></div><div className="flex flex-wrap gap-2">{showtimes.map((time) => <button key={time} onClick={() => setSelectedTime(time)} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${selectedTime === time ? 'border-[#d86448] bg-[#d86448] text-white' : 'border-[#d8d4cc] hover:border-[#b65a42]'}`}>{time}</button>)}</div><div className="mt-7 flex flex-col justify-between gap-4 border-t border-[#e1ded7] pt-5 sm:flex-row sm:items-center"><div className="flex items-start gap-2 text-sm"><MapPin size={17} className="mt-0.5 text-[#b65a42]" /><span><strong>The Grand Hall</strong><br /><span className="text-[#777d77]">14 Orchard Street · Screen 04</span></span></div><button onClick={openBooking} className="rounded-full bg-[#26362d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#34483b]">Choose seats <ArrowRight className="ml-1 inline" size={15} /></button></div></div>
        </section>
      </main>

      <footer id="about" className="border-t border-[#d9d6ce] bg-[#ebe8e1]"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-4 px-6 py-8 text-sm text-[#69706b] sm:flex-row lg:px-10"><span className="font-bold text-[#202522]">imovies</span><span>Good films. Great seats. Better memories.</span><span>© 2026 imovies</span></div></footer>

      {bookingOpen && <div className="fixed inset-0 z-20 flex items-end justify-center bg-[#17221c]/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-t-3xl bg-[#faf9f6] p-6 sm:rounded-3xl sm:p-8"><div className="mb-7 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b65a42]">Step 1 of 2</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Choose your seats</h2></div><button onClick={() => setBookingOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-[#eeece6]" aria-label="Close"><X size={18} /></button></div><div className="mb-7 rounded-2xl bg-[#eef0eb] p-4"><div className="flex items-center justify-between"><span className="font-semibold">{selectedMovie.title}</span><span className="text-sm text-[#6a706c]">{selectedDate.day}, Oct {selectedDate.number} · {selectedTime}</span></div></div><div className="mx-auto max-w-md"><div className="mb-8 text-center"><div className="screen-line" /><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#999d98]">Screen</p></div><div className="space-y-3">{seatRows.map((row) => <div key={row} className="flex items-center gap-3"><span className="w-4 text-xs font-bold text-[#969c96]">{row}</span><div className="grid flex-1 grid-cols-8 gap-2">{seatNumbers.map((number) => { const seat = `${row}${number}`; const occupied = occupiedSeats.has(seat); const selected = selectedSeats.includes(seat); return <button key={seat} disabled={occupied} onClick={() => toggleSeat(seat)} aria-label={`Seat ${seat}`} className={`seat ${occupied ? 'seat-occupied' : selected ? 'seat-selected' : 'seat-available'}`} />; })}</div></div>)}</div><div className="mt-7 flex justify-center gap-5 text-xs text-[#777d77]"><span><i className="legend bg-[#dfe2dc]" />Available</span><span><i className="legend bg-[#d86448]" />Selected</span><span><i className="legend bg-[#aeb5ad]" />Occupied</span></div></div><div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#e1ded7] pt-5 sm:flex-row sm:items-center"><div><p className="text-sm text-[#777d77]">{selectedSeats.length} seat{selectedSeats.length === 1 ? '' : 's'} selected</p><p className="text-2xl font-semibold">${total.toFixed(2)}</p></div><button disabled={!selectedSeats.length} onClick={() => { setBookingOpen(false); setDetailsOpen(true); }} className="rounded-full bg-[#26362d] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Continue <ArrowRight className="ml-1 inline" size={15} /></button></div></div></div>}

      {detailsOpen && <div className="fixed inset-0 z-30 flex items-end justify-center bg-[#17221c]/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div className="w-full max-w-md rounded-t-3xl bg-[#faf9f6] p-6 sm:rounded-3xl sm:p-8"><div className="mb-7 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b65a42]">Final step</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Almost there.</h2></div><button onClick={() => setDetailsOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-[#eeece6]" aria-label="Close"><X size={18} /></button></div><form onSubmit={submitBooking} className="space-y-4"><label className="block text-sm font-semibold">Your name<input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d4cc] bg-transparent px-4 py-3 font-normal outline-none focus:border-[#b65a42]" placeholder="Alex Morgan" /></label><label className="block text-sm font-semibold">Email address<input required type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d4cc] bg-transparent px-4 py-3 font-normal outline-none focus:border-[#b65a42]" placeholder="alex@example.com" /></label><div className="rounded-xl bg-[#eef0eb] p-4 text-sm"><div className="flex justify-between"><span>{selectedSeats.join(', ')}</span><strong>${total.toFixed(2)}</strong></div><p className="mt-1 text-[#777d77]">{selectedMovie.title} · {selectedTime}</p></div>{bookingError && <p className="text-sm font-semibold text-[#b64a3d]">{bookingError}</p>}<button disabled={isSubmitting} className="mt-2 w-full rounded-full bg-[#d86448] py-3.5 text-sm font-bold text-white transition hover:bg-[#e27256] disabled:opacity-50">{isSubmitting ? 'Confirming…' : 'Confirm booking'} <Ticket className="ml-1 inline" size={16} /></button></form></div></div>}

      {confirmation && <div className="fixed inset-0 z-40 grid place-items-center bg-[#17221c]/70 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl bg-[#faf9f6] p-8 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dce9dc] text-[#3f7651]"><Check size={30} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#b65a42]">Booking confirmed</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Enjoy the show.</h2><p className="mt-3 text-sm leading-6 text-[#6a706c]">Your tickets are ready. We’ve sent the details to {customerEmail}.</p><div className="my-7 rounded-2xl border border-dashed border-[#c6c9c1] p-5 text-left"><div className="flex justify-between text-sm"><span className="text-[#777d77]">Reference</span><strong>{confirmation.confirmationCode}</strong></div><div className="mt-4 flex justify-between text-sm"><span className="text-[#777d77]">Seats</span><strong>{confirmation.seats.join(', ')}</strong></div><div className="mt-4 flex justify-between text-sm"><span className="text-[#777d77]">When</span><strong>Oct {confirmation.date} · {confirmation.time}</strong></div></div><button onClick={() => setConfirmation(null)} className="w-full rounded-full bg-[#26362d] py-3.5 text-sm font-bold text-white">Done</button></div></div>}
    </div>
  );
}

export default App;
