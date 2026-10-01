/**
 * "Inside a request": one booking request followed through a Laravel app,
 * step by step. The code is illustrative (how I'd write it), not lifted from
 * a client project. Edit or reorder the steps freely.
 */
export interface JourneyStep {
  layer: string;
  title: string;
  body: string;
  code: string;
}

export const journey: JourneyStep[] = [
  {
    layer: "client",
    title: "The browser sends it",
    body: "A visitor submits the booking form. Inertia posts it to Laravel without a full page reload.",
    code: `router.post("/reservations", {
  table_id: 4,
  starts_at: "2026-10-03 19:00",
  guests: 2,
});`,
  },
  {
    layer: "edge",
    title: "Cloudflare takes it in",
    body: "DNS and TLS are handled at the edge, then the request goes down the tunnel to the server. No open ports at home.",
    code: `yushika.my.id
  -> Cloudflare edge (TLS)
  -> cloudflared tunnel
  -> http://localhost:8000`,
  },
  {
    layer: "routing",
    title: "A route picks it up",
    body: "The route maps the URL to a controller. Middleware checks the visitor is signed in before anything else runs.",
    code: `Route::post('/reservations', [ReservationController::class, 'store'])
    ->middleware('auth');`,
  },
  {
    layer: "validation",
    title: "Input gets checked",
    body: "A form request rejects bad input before it reaches the database, and sends the errors straight back to the form.",
    code: `public function rules(): array
{
    return [
        'table_id'  => ['required', 'exists:tables,id'],
        'starts_at' => ['required', 'date', 'after:now'],
        'guests'    => ['required', 'integer', 'between:1,12'],
    ];
}`,
  },
  {
    layer: "domain",
    title: "The booking is written safely",
    body: "Checking the slot and saving the booking happen in one transaction, so two people can't take the same table.",
    code: `DB::transaction(function () use ($data) {
    $taken = Reservation::where('table_id', $data['table_id'])
        ->where('starts_at', $data['starts_at'])
        ->lockForUpdate()
        ->exists();

    abort_if($taken, 409, 'That table is already booked.');

    return Reservation::create($data);
});`,
  },
  {
    layer: "database",
    title: "PostgreSQL stores it",
    body: "Eloquent turns that into plain SQL. An index on (table_id, starts_at) keeps the availability check fast.",
    code: `insert into "reservations"
  ("table_id", "starts_at", "guests", "user_id")
values (4, '2026-10-03 19:00', 2, 17)
returning "id";`,
  },
  {
    layer: "async",
    title: "The email goes out later",
    body: "The confirmation email is queued, so the visitor doesn't wait on the mail server.",
    code: `Mail::to($request->user())
    ->queue(new ReservationConfirmed($reservation));`,
  },
  {
    layer: "response",
    title: "The page updates",
    body: "Laravel redirects back with a flash message and Inertia swaps in the new page state.",
    code: `return to_route('reservations.show', $reservation)
    ->with('status', 'Table booked. Check your email.');`,
  },
];
