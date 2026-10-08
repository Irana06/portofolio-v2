/**
 * "Inside a request": one tournament registration followed through a Laravel app,
 * step by step, modelled on Badmintoon Portal. The code is illustrative (how I'd
 * write it), not lifted from the project. Edit or reorder the steps freely.
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
    title: "The form is sent",
    body: "A player submits the registration form. Inertia posts it without a page reload.",
    code: `router.post("/registrations", {
  category_id: 3,
  player_name: "Rina",
});`,
  },
  {
    layer: "routing",
    title: "Only players get in",
    body: "The route checks the user is signed in and has the player role.",
    code: `Route::post('/registrations', [RegistrationController::class, 'store'])
    ->middleware(['auth', 'role:player']);`,
  },
  {
    layer: "validation",
    title: "Bad input stops here",
    body: "A form request rejects invalid data and sends the errors back to the form.",
    code: `return [
    'category_id' => ['required', 'exists:categories,id'],
    'player_name' => ['required', 'string', 'max:100'],
];`,
  },
  {
    layer: "database",
    title: "Saved in one transaction",
    body: "The registration and its payment record are written together, or not at all.",
    code: `DB::transaction(function () use ($data) {
    $reg = Registration::create($data);
    $reg->transaction()->create(['status' => 'pending']);
});`,
  },
  {
    layer: "response",
    title: "The page updates",
    body: "Laravel redirects back with a message and Inertia swaps in the new state.",
    code: `return back()->with('status', 'Registered. Payment pending.');`,
  },
];
