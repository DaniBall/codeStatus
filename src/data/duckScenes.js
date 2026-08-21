/**
 * Escenas de patos para cada código de estado HTTP.
 *
 * Cada entrada describe una foto ultrarrealista y graciosa protagonizada por
 * patos, cuya situación explica visualmente el significado del código.
 * A partir de estas escenas la web construye el prompt con el que se genera
 * la imagen (ver `src/duckImage.js`).
 */
const duckScenes = {
  100: 'a mallard duck crouched in a sprinter starting block on an athletics track, wearing a tiny sweatband, mid-launch, coach ducks with whistles waving it forward',
  101: 'a duck inside a red phone booth caught mid costume change, one half still in a pinstripe business suit and the other half already in scuba gear with flippers',
  102: 'a duck wearing tiny round glasses staring at a laptop showing an endless spinning loading wheel, surrounded by seven empty coffee cups at 3am',
  103: 'a duck peeking around a theatre curtain before the show, holding up handwritten cue cards to the audience while the stage behind is still empty',
  200: 'a duck floating on a pink flamingo pool float wearing mirrored sunglasses, holding a tiny cocktail and giving a confident thumbs-up with its wing',
  201: 'a proud mother duck presenting a freshly hatched wet duckling to the camera in a hospital nursery, tiny balloons that read new arrival tied to the nest',
  202: 'a duck behind a grey government counter stamping a form marked PENDING, the stamp frozen mid-air, an enormous queue of ducks waiting behind',
  203: 'two ducks in trench coats whispering gossip behind a newspaper in a park, one raising a suspicious eyebrow at the other',
  204: 'a single duck standing in the middle of a completely empty white gallery room, staring at a blank wall, absolutely nothing else in the frame',
  205: 'a duck slamming a big red RESET button with its wing while an Etch A Sketch beside it shakes itself blank, papers flying everywhere',
  206: 'a duck upended in a pond with only its tail and orange feet above the waterline, the entire head and neck hidden underwater',
  207: 'five rubber ducks lined up on a bathroom shelf, each one with a completely different facial expression, from delighted to devastated',
  208: 'a duck rolling its eyes with a wing over its face while an over-excited duck beside it retells the exact same story for the fifth time',
  226: 'a duck vacuum-sealed inside a transparent compression storage bag, comically flattened but still calm and dignified',
  300: 'a duck standing at a fork where five muddy paths split in different directions, holding a map upside down, completely paralysed by the choice',
  301: 'a duck family carrying cardboard boxes away from a drained pond, a weathered wooden sign nailed beside it reading WE MOVED with an arrow',
  302: 'a duck sitting in a small inflatable paddling pool on a lawn next to its empty proper pond, with a handwritten sign reading back soon',
  303: 'a duck insistently pointing its wing at a completely different duck across the pond, refusing to make eye contact with the camera',
  304: 'a duck sitting on a nest covered in a dust sheet and cobwebs, everything exactly as it was left, a thick layer of dust on the eggs',
  305: 'a duck wearing an obviously fake plastic nose, glasses and moustache disguise, standing in for another duck at a podium',
  306: 'a single dusty rubber duck displayed alone in a glass museum vitrine with a brass plaque reading RESERVED, velvet rope around it',
  307: 'a duck in a hi-vis vest working as a traffic cop, redirecting a line of ducklings around a puddle with a single orange cone',
  308: 'a duck construction worker in a hard hat cementing a permanent metal detour arrow sign into fresh concrete beside a filled-in pond',
  400: 'a duck leaning out of a car window quacking absolute gibberish into a drive-through speaker while the cashier duck stares back baffled',
  401: 'a muscular bouncer duck in a black bomber jacket blocking a velvet rope, refusing entry to a small duck with no wristband',
  402: 'a duck at a supermarket checkout holding out an empty wallet with a single moth flying out of it, the card machine beeping in refusal',
  403: 'a stern security duck in mirrored sunglasses crossing its wings in front of a padlocked gate, a NO DUCKS sign bolted behind it',
  404: 'a duck with a head torch and a magnifying glass searching a completely empty nest at night, a missing poster for an egg taped to a tree',
  405: 'a duck earnestly trying to eat soup with a fork while a referee duck blows a whistle and shows it a red card',
  406: 'a food critic duck with a monocle pushing away a plate in visible disgust, the waiter duck sweating profusely beside the table',
  407: 'a duck in a tollbooth on a wooden bridge demanding to see a laminated badge before it will raise the barrier for another duck',
  408: 'a duck fast asleep face-down at a restaurant table with cobwebs between its beak and the untouched cutlery, the waiter never came',
  409: 'two ducks in a violent tug-of-war over the exact same slice of bread, feathers exploding into the air between them',
  410: 'a cracked dry pond bed at sunset with a single duck feather and a small wooden headstone reading GONE, one lonely duck staring at where the water used to be',
  411: 'a duck attendant at a fairground ride holding a tape measure, refusing to let a duck board until it is properly measured',
  412: 'a small duck standing on tiptoes against a you must be this tall sign at a rollercoaster, still hopelessly short, ride operator shaking its head',
  413: 'a tiny duckling trying to carry an enormous watermelon on its back, legs buckling and eyes wide with regret',
  414: 'a duck holding a receipt so long it unrolls out of the shop, down the street and around the corner into the distance',
  415: 'a duck determinedly trying to insert a floppy disk into a toaster, smoke already starting to rise from the slot',
  416: 'a duck stretching desperately off the very edge of a picnic table towards a slice of bread that is far beyond any possible reach',
  417: 'a duck in a party hat staring at a birthday cake that has completely collapsed into a puddle of frosting, single candle still lit',
  418: 'a duck wearing a porcelain teapot as a hat with real steam pouring from the spout, firmly pushing away an offered cup of coffee',
  421: 'a postal worker duck delivering a parcel to a nest in the wrong pond entirely, the resident duck pointing furiously in another direction',
  422: 'a duck surrounded by unidentifiable flat-pack furniture parts, holding assembly instructions written in an alien alphabet, upside down',
  423: 'a duck locked out of its own nest by an absurdly large brass padlock, holding a key that has snapped clean in half',
  424: 'a long line of ducks toppled over like dominoes across a lawn, all because the very first duck tripped on a garden hose',
  425: 'a duck in a party hat and streamers standing alone in a fully decorated empty hall at 6am, clock on the wall confirming it is far too early',
  426: 'a duck holding an ancient flip phone being shown a brand new smartphone by an unimpressed shop assistant duck',
  428: 'a clipboard-wielding bouncer duck demanding a signed and stamped consent form before it will let another duck through the door',
  429: 'one exhausted duck completely engulfed by a swarm of a hundred ducklings all demanding bread at the same time, bread bag already empty',
  431: 'a duck wearing an absurdly enormous ornate hat that is ten times its own size, neck bent sideways under the weight',
  451: 'a duck in a courtroom beside a lawyer duck in a wig, a sealed evidence box stamped CENSORED on the table between them',
  500: 'a singed duck standing in a smoking server room holding a tiny fire extinguisher, sparks raining down, feathers slightly on fire',
  501: 'a duck reading a completely blank instruction manual in front of an unfinished building with a faded COMING SOON banner',
  502: 'two ducks on opposite rooftops holding tin cans connected by a string that has snapped clean in the middle, both shouting into their cans',
  503: 'an empty lifeguard chair beside a drained pond with a hand-painted sign reading OUT TO LUNCH, BACK IN 5, a queue of ducks waiting outside the locked gate',
  504: 'a duck waiting at a rural mailbox in a snowstorm, snow piled on its head, calendar pages blowing past, the post never arrives',
  505: 'a duck trying to play a vinyl record by pressing it against the screen of a modern laptop, deeply confused by the lack of sound',
  506: 'two absolutely identical ducks at a negotiation table pointing accusingly at each other, reflected into infinity by mirrors on both walls',
  507: 'an overwhelmed duck perched on a nest overflowing with far too many eggs, eggs spilling down the tree and piling up on the ground below, no room left',
  508: 'a duck chasing its own tail in a perfect circle with heavy motion blur, the water beneath it spun into a spiral whirlpool',
  510: 'a duck at the bottom of a stepladder that is comically too short to reach the loaf of bread on the very top shelf',
  511: 'a duck at an airport café glaring at a tablet showing a hostile wifi login portal, boarding pass and cold coffee beside it',
};

/**
 * Sufijo de estilo que se añade a todas las escenas para conseguir el look
 * "fotografía ultrarrealista" que pide el proyecto.
 */
export const DUCK_STYLE =
  'ultra realistic photograph, photorealistic, 85mm lens, shallow depth of field, ' +
  'natural lighting, highly detailed feathers, humorous scene, no text, no watermark';

export default duckScenes;
