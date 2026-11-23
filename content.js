/* ===================================================================
   content.js: all the words and lists live here.
   - Add a card: copy one { ... } line inside a list and edit it.
   - Remove a card: delete that { ... } line (watch the commas).
   - Anything still saying "here" or "20XX" is a placeholder.
=================================================================== */
window.SITE = {

    /* ---------- 01 · HELLO ---------- */
    hello: {
        names: { primary: "Shenka", alt: "Aze", full: "Sashenka Osaze" },
        tagline: "Final-year IT student. Curious about most things, obsessed with a few.",
        intro: "I'm Sashenka, but Shenka or Aze works too. I'm finishing vocational school in Software Development, and I learn best by taking things apart and putting them back together. Below: where I studied, what I'm into outside class, and some music while you look around.",
        avatar: "assets/avatar.svg",          // swap for "assets/me.jpg" when you have a photo
        avatarAlt: "Placeholder portrait: a bust split into a red half and a blue half",
        photoCaption: "Placeholder. Maybe I'll upload my selfie sometimes.",
        status: [
            { label: "Now", text: "Final year at SMK, majoring in IT" },
        ]
    },

    /* ---------- 02 · EDUCATION ---------- */
    school: {
        no: "02",
        title: "Education",
        blurb: "Three folders, one of them still open.",
        levels: [
            { level: "SD", name: "Elementary school", school: "SD Islam Ibnu Hajar", years: "2015 – 2021" },
            { level: "SMP", name: "Junior high school", school: "SMP Negeri 13 Bogor", years: "2021 – 2024" },
            {
                level: "SMK", name: "Vocational high school", school: "SMKS WIKRAMA BOGOR", years: "2024 – now",
                major: "Software Development", note: "3rd year.", current: true
            }
        ],
        internship: {
            title: "Industrial internship (PKL)",
            length: "6 months",
            where: "PT. Lifetech Tanpa Batas & PT. Hexaon Business Mitrasindo",
            status: "In transit",
            note: ""
        }
    },

    /* ---------- 03 · PROJECTS ----------
   Aim for 3 to 5. The first one shows large, so put your best one first.
   Add a project: copy one { ... } block. Remove: delete it (watch the commas).
   image: screenshot in assets/projects/ (about 1200x750, under 200 KB). "" shows a coloured placeholder.
   links: a link with an empty href is hidden, so fill it in only when it's real. */
    projects: {
        no: "03",
        title: "Projects",
        blurb: "A few things I built during school and my internship or... just for fun.",
        items: [
            {
                name: "Project name here", kind: "Internship (PKL)", year: "20XX",
                tagline: "One line about what it does.",
                summary: "Two or three sentences: the problem, what you built, and what came out of it.",
                role: "What you personally did.",
                stack: ["Tech A", "Tech B", "Tech C"],
                image: "", imageAlt: "",
                links: [{ label: "Source code", href: "" }, { label: "Live demo", href: "" }]
            },

            {
                name: "Project name here", kind: "School project", year: "20XX",
                tagline: "One line about what it does.",
                summary: "Two or three sentences about the project.",
                role: "Your part in it.",
                stack: ["Tech A", "Tech B"],
                image: "", imageAlt: "",
                links: [{ label: "Source code", href: "" }]
            },

            {
                name: "Project name here", kind: "School project", year: "20XX",
                tagline: "One line about what it does.",
                summary: "Two or three sentences about the project.",
                role: "Your part in it.",
                stack: ["Tech A", "Tech B"],
                image: "", imageAlt: "",
                links: []
            }
        ]
    },

    /* ---------- 04 · FIELD NOTES ---------- */
    notes: {
        no: "04",
        title: "Field notes",
        blurb: "What I read, watch and wonder about when nobody is grading it.",

        cycle: {
            title: "Sky",
            lead: "Astronomy is where my long-distance thinking starts. I keep getting pulled toward the biggest things there are: stars, galaxies, objects too massive to picture.",
            blurb: "Start with a star. Drag the mass slider to change how heavy it is at birth, or follow the cards and pick at each fork. Everything that can happen is explained along the way.",
            start: "cloud",

            mass: {
                min: 0.04, max: 200, start: 1,
                zones: [
                    { from: 0.04, to: 0.08, name: "Brown dwarf", color: "#8B3F63", result: "never ignites" },
                    { from: 0.08, to: 0.5, name: "Red dwarf", color: "#E86A4A", result: "burns for trillions of years" },
                    { from: 0.5, to: 8, name: "Sun-like", color: "#FFD25A", result: "ends as a white dwarf" },
                    { from: 8, to: 25, name: "Massive", color: "#8FB8FF", result: "supernova, then a neutron star" },
                    { from: 25, to: 130, name: "Very massive", color: "#CFE3FF", result: "most likely a black hole" },
                    { from: 130, to: 200, name: "Extreme", color: "#F2E9C9", result: "torn apart, nothing left" }
                ],
                // striped bands: where the boundary between two outcomes is still debated
                unsure: [[7, 10], [20, 40], [110, 160]]
            },

            // radius next to the Sun (1 = the Sun), for the size ruler. Leave a stage out to hide the ruler there.
            sizes: {
                brown: { r: 0.1, t: "about Jupiter-sized" },
                reddwarf: { r: 0.25, t: "0.1 to 0.5 Suns wide" },
                sunlike: { r: 1, t: "about the Sun's size" },
                redgiant: { r: 50, t: "tens to hundreds of Suns" },
                whitedwarf: { r: 0.009, t: "about Earth-sized" },
                blackdwarf: { r: 0.009, t: "about Earth-sized" },
                massive: { r: 6, t: "several Suns wide" },
                supergiant: { r: 800, t: "hundreds of Suns, up to ~1,000" },
                ironcore: { r: 0.006, t: "thousands of km across" },
                neutron: { r: 0.000014, t: "about 20 km across" },
                pulsar: { r: 0.000014, t: "about 20 km across" },
                magnetar: { r: 0.000014, t: "about 20 km across" },
                blackhole: { r: 0.00004, t: "tens of km across" }
            },

            /* HOW TO USE YOUR OWN IMAGES
               Each stage below has an optional  image: ""  line.
               - Leave it empty and the built-in animated drawing is used.
               - To use your own, put the file in assets/stars/ and write  image: "assets/stars/name.webp"
                 Best: PNG or WebP with a TRANSPARENT background, about 800x600, under 150 KB.
                 (A full-size picture also works, it is scaled to fit.)
               - imageAlt: a one-line description for screen readers.
               - imageCredit: if the picture isn't yours, add the credit text, it shows under the text.
               NASA and ESA/Webb pictures usually need credit. Check each picture's usage rules. */

            nodes: {
                cloud: {
                    art: "cloud", image: "", imageAlt: "", imageCredit: "",
                    short: "Nebula", tag: "Stage 1 · Birth", title: "Nebula (molecular cloud)", aka: "Also called a stellar nursery",
                    text: "Stars begin in cold, dense clouds of gas and dust, made mostly of hydrogen with some helium. When part of a cloud gets dense enough, its own gravity starts pulling it together.",
                    facts: [["Made of", "Mostly hydrogen, some helium, a little dust"], ["Size", "Up to around 100 light-years across"], ["Trigger", "Gravity beats the cloud's internal pressure"]],
                    next: [{ to: "protostar" }]
                },

                protostar: {
                    art: "protostar", image: "", imageAlt: "", imageCredit: "",
                    short: "Protostar", tag: "Stage 2 · Collapse", title: "Protostar",
                    text: "A dense clump keeps contracting and heating up, flattening into a spinning disk with jets shooting out along its axis. It shines on gravitational energy alone. Fusion has not started yet.",
                    facts: [["Powered by", "Gravity, not fusion"], ["Fusion starts at", "A core temperature of roughly 10 million °C"], ["Deciding factor", "Mass. Everything from here depends on it"]],
                    ask: "How much mass did the clump gather?",
                    next: [
                        { to: "brown", label: "Too light to ignite", hint: "Under about 0.08 Suns" },
                        { to: "reddwarf", label: "A small star", hint: "About 0.08 to 0.5 Suns" },
                        { to: "sunlike", label: "A Sun-like star", hint: "About 0.5 to 8 Suns" },
                        { to: "massive", label: "A heavyweight", hint: "More than about 8 Suns" }]
                },

                brown: {
                    art: "brown", image: "", imageAlt: "", imageCredit: "",
                    short: "Brown dwarf", tag: "Final · Failed star", title: "Brown dwarf", aka: "Sometimes called a failed star",
                    text: "With too little mass, the core never gets hot enough to fuse ordinary hydrogen. Objects above roughly 13 Jupiter masses can briefly burn deuterium, a heavier form of hydrogen, but that fades quickly.",
                    facts: [["Mass", "About 13 to 80 Jupiters, up to ~0.08 Suns"], ["Glows by", "Leftover heat from its formation, mostly infrared"], ["Fate", "Cools and dims over a very long time"]],
                    end: "End of this path: a brown dwarf never truly ignites. It just cools toward the temperature of space."
                },

                reddwarf: {
                    art: "reddwarf", image: "", imageAlt: "", imageCredit: "",
                    short: "Red dwarf", tag: "Final · Small star", title: "Red dwarf",
                    text: "The most common kind of star. Small, cool and dim, it sips its hydrogen so slowly that it can shine for trillions of years. The Universe is only about 13.8 billion years old, so no red dwarf has had time to die yet.",
                    facts: [["Mass", "About 0.08 to 0.5 Suns"], ["Lifespan", "Hundreds of billions to trillions of years"], ["Example", "Proxima Centauri, the nearest star to the Sun"]],
                    end: "End of this path, by prediction: models say a red dwarf eventually fades into a helium white dwarf and then a black dwarf. None has got there yet."
                },

                sunlike: {
                    art: "sunlike", image: "", imageAlt: "", imageCredit: "",
                    short: "Main sequence", tag: "Stage 3 · Main sequence", title: "Main sequence star", aka: "The Sun is one of these",
                    text: "Hydrogen fuses into helium in the core. The outward push of that energy balances gravity, so the star stays steady. This is the longest chapter of a star's life.",
                    facts: [["Mass", "About 0.5 to 8 Suns"], ["Lifespan", "Around 10 billion years for the Sun"], ["The Sun now", "Roughly halfway through"]],
                    next: [{ to: "redgiant" }]
                },

                redgiant: {
                    art: "redgiant", image: "", imageAlt: "", imageCredit: "",
                    short: "Red giant", tag: "Stage 4 · Swelling", title: "Red giant",
                    text: "When the core runs out of hydrogen, fusion continues in a shell around it. The outer layers swell and cool, so the star glows red. Later the core gets hot enough to fuse helium into carbon.",
                    facts: [["Size", "Tens to hundreds of times wider than the Sun"], ["Duration", "Around a billion years for a Sun-like star"], ["The Sun's turn", "In roughly 5 billion years, and Earth may be swallowed"]],
                    next: [{ to: "nebula" }]
                },

                nebula: {
                    art: "nebula", image: "", imageAlt: "", imageCredit: "",
                    short: "Shell", tag: "Stage 5 · Shedding", title: "Planetary nebula", aka: "Nothing to do with planets",
                    text: "The red giant blows off its outer layers as an expanding shell of glowing gas. Old telescopes made these shells look like planets, and the name stuck. At the center, the hot bare core is left behind.",
                    facts: [["Lifetime", "Visible for only about 50,000 years"], ["Lit by", "The hot core inside, over 100,000 °C"], ["Example", "The Cat's Eye Nebula"]],
                    next: [{ to: "whitedwarf" }]
                },

                whitedwarf: {
                    art: "whitedwarf", image: "", imageAlt: "", imageCredit: "",
                    short: "White dwarf", tag: "Stage 6 · Remnant", title: "White dwarf",
                    text: "The leftover core is about as wide as Earth but holds a large share of the Sun's mass. Nothing is fusing. It is held up by electron degeneracy pressure, a quantum effect, and it cannot exceed about 1.4 Suns.",
                    facts: [["Density", "A teaspoon would weigh about 5.5 tons on Earth"], ["Limit", "The Chandrasekhar limit, about 1.4 Suns"], ["Example", "Sirius B, the nearest known white dwarf"]],
                    ask: "What happens to it next?",
                    next: [
                        { to: "blackdwarf", label: "Left alone", hint: "It just cools" },
                        { to: "typeIa", label: "Feeding on a companion", hint: "In a binary, it gains mass" }]
                },

                blackdwarf: {
                    art: "blackdwarf", image: "", imageAlt: "", imageCredit: "",
                    short: "Black dwarf", tag: "Final · Hypothetical", title: "Black dwarf",
                    text: "Over hundreds of billions to a trillion years, a white dwarf radiates away its heat until it is cold and dark. The Universe is not old enough for any to exist yet.",
                    facts: [["Status", "Predicted, never observed"], ["Cooling time", "Hundreds of billions of years or more"], ["Further out", "One 2025 estimate has even white dwarfs decaying after about 10⁷⁸ years. That is speculative"]],
                    end: "End of this path: a quiet, dark remnant."
                },

                typeIa: {
                    art: "typeIa", image: "", imageAlt: "", imageCredit: "",
                    short: "Type Ia", tag: "Final · Explosion", title: "Type Ia supernova",
                    text: "A white dwarf can pull gas from a companion star, or merge with another white dwarf. Once it passes about 1.4 Suns, it detonates and is blown apart. These blasts are bright and consistent enough to help measure cosmic distances.",
                    facts: [["Trigger", "Crossing the ~1.4 Sun limit"], ["Brightness", "Can briefly rival billions of Suns"], ["Remnant", "Usually none, the white dwarf is destroyed"]],
                    end: "End of this path: the star is gone, and its ashes, rich in iron, drift into space."
                },

                massive: {
                    art: "massive", image: "", imageAlt: "", imageCredit: "",
                    short: "Main sequence", tag: "Stage 3 · Main sequence", title: "Massive star",
                    text: "Hot, blue-white and enormous, a heavyweight burns through its hydrogen at a furious pace. A star ten times the Sun's mass lasts only a few tens of millions of years, against the Sun's ten billion.",
                    facts: [["Mass", "Over about 8 Suns. The upper limit is uncertain, often quoted at 150 to 200"], ["Lifespan", "A few million to a few tens of millions of years"], ["Rarity", "Few and short-lived next to small stars"]],
                    next: [{ to: "supergiant" }]
                },

                supergiant: {
                    art: "supergiant", image: "", imageAlt: "", imageCredit: "",
                    short: "Supergiant", tag: "Stage 4 · Swelling", title: "Supergiant", aka: "Red supergiants such as Betelgeuse",
                    text: "The star swells far beyond a normal giant and fuses heavier and heavier elements in quick succession: helium, carbon, oxygen, silicon. Each stage burns faster than the last, and the star sheds mass as it goes.",
                    facts: [["Size", "Up to around a thousand times the Sun's radius"], ["Example", "Betelgeuse, in Orion"], ["Output", "Builds elements up to iron in the core"]],
                    ask: "How massive was it at birth?",
                    next: [
                        { to: "ironcore", label: "A typical heavyweight", hint: "Roughly 8 to 130 Suns" },
                        { to: "pair", label: "Extremely massive", hint: "More than about 130 Suns" }]
                },

                ironcore: {
                    art: "ironcore", image: "", imageAlt: "", imageCredit: "",
                    short: "Iron core", tag: "Stage 5 · The turning point", title: "Iron core",
                    text: "By now the star is layered like an onion: hydrogen outside, then helium, carbon, oxygen, silicon, and iron at the center. Fusing iron does not release energy, it costs energy, so the core has nothing left to hold itself up.",
                    facts: [["Last stages", "Days, not millions of years"], ["Why iron", "Fusing it cannot pay back energy"], ["Next", "The core collapses"]],
                    ask: "How does the collapse play out?",
                    next: [
                        { to: "supernova", label: "The core rebounds", hint: "A bright explosion, the usual outcome" },
                        { to: "direct", label: "The star implodes quietly", hint: "Little or no explosion, possible for some heavier stars" }]
                },

                supernova: {
                    art: "supernova", image: "", imageAlt: "", imageCredit: "",
                    short: "Supernova", tag: "Stage 6 · Explosion", title: "Core-collapse supernova", aka: "Type II, and the stripped Types Ib and Ic",
                    text: "The iron core collapses in under a second, shrinking from thousands of kilometers to about 20. The infalling material rebounds, a shock wave tears through the star, and the outer layers are thrown into space. Neutrinos carry away much of the energy.",
                    facts: [["Collapse time", "Less than a second"], ["Variants", "Type II keeps its hydrogen envelope, Ib and Ic have lost it"], ["Legacy", "Scatters carbon, oxygen, iron and more, the raw material for new stars and planets"], ["Example", "The Crab Nebula, seen from Earth in 1054"]],
                    ask: "What is left in the middle?",
                    next: [
                        { to: "neutron", label: "A neutron star", hint: "A core of roughly 1 to 3 Suns" },
                        { to: "blackhole", label: "A black hole", hint: "A core too heavy for anything to stop" }]
                },

                direct: {
                    art: "direct", image: "", imageAlt: "", imageCredit: "",
                    short: "Collapse", tag: "Stage 6 · Collapse", title: "Direct collapse", aka: "A failed supernova",
                    text: "In some massive stars the shock wave stalls, and the whole star falls into a black hole with little or no explosion. Astronomers have one strong candidate: a star of around 25 Suns that dimmed and vanished in Hubble images without a supernova.",
                    facts: [["Result", "A black hole"], ["Evidence", "One strong candidate so far, not settled"], ["Open question", "Exactly which stars explode and which collapse"]],
                    next: [{ to: "blackhole" }]
                },

                pair: {
                    art: "pair", image: "", imageAlt: "", imageCredit: "",
                    short: "Pair-instability", tag: "Final · Obliteration", title: "Pair-instability supernova",
                    text: "In stars above about 130 Suns, the core gets so hot that gamma rays turn into electron and positron pairs. Pressure drops, the core collapses, and runaway fusion blows the entire star apart. Nothing is left, not even a black hole.",
                    facts: [["Mass", "Roughly 130 Suns and up, at birth"], ["Remnant", "None"], ["Clue", "Gravitational-wave data point to a gap in black hole masses that this would explain. Still being tested"]],
                    end: "End of this path: the star is completely scattered. Even heavier stars are expected to collapse into black holes again."
                },

                neutron: {
                    art: "neutron", image: "", imageAlt: "", imageCredit: "",
                    short: "Neutron star", tag: "Stage 7 · Remnant", title: "Neutron star",
                    text: "If the collapsing core holds roughly 1 to 3 Suns, neutrons stop the collapse. Protons and electrons are crushed into neutrons, packing a Sun's worth of mass into a ball about 20 km wide.",
                    facts: [["Size", "About 20 km across, the width of a city"], ["Density", "A sugar-cube lump would weigh about half a trillion kg"], ["Heaviest possible", "About 2.2 Suns when not spinning (estimates run 2.16 to 2.3). More than that becomes a black hole"]],
                    ask: "Pick a path for this neutron star.",
                    next: [
                        { to: "pulsar", label: "Pulsar", hint: "Beams sweep past like a lighthouse" },
                        { to: "magnetar", label: "Magnetar", hint: "A magnetic field about 1,000 times stronger" },
                        { to: "kilonova", label: "Merger", hint: "It collides with a partner" }]
                },

                pulsar: {
                    art: "pulsar", image: "", imageAlt: "", imageCredit: "",
                    short: "Pulsar", tag: "Final · Slowing down", title: "Pulsar",
                    text: "A neutron star whose beams of radiation sweep through space as it spins. If a beam crosses Earth, we see a pulse. Over time it loses spin and its field weakens, and the pulsing stops after about 10 million years.",
                    facts: [["Example", "The Crab pulsar, pulsing about every 33 milliseconds"], ["Why so fast", "The core spins up as it shrinks, like a skater pulling in their arms"], ["Later", "A dark, cooling neutron star"]],
                    end: "End of this path: a cold neutron star. A 2025 theory paper suggests even those would decay after about 10⁶⁷ years, which is speculative."
                },

                magnetar: {
                    art: "magnetar", image: "", imageAlt: "", imageCredit: "",
                    short: "Magnetar", tag: "Final · Outbursts", title: "Magnetar",
                    text: "A neutron star with the strongest magnetic field known, about 1,000 times a typical neutron star's, which is already trillions of times Earth's. Movements in its crust release huge bursts of energy.",
                    facts: [["Field", "About 10 trillion times a fridge magnet"], ["Born in", "Possibly some unusually bright supernovae"], ["Later", "Its field decays and the outbursts fade"]],
                    end: "End of this path: a quieter neutron star."
                },

                kilonova: {
                    art: "kilonova", image: "", imageAlt: "", imageCredit: "",
                    short: "Merger", tag: "Stage 8 · Collision", title: "Neutron-star merger", aka: "Produces a kilonova",
                    text: "Two neutron stars in orbit lose energy as gravitational waves and spiral together. The 2017 event GW170817 was seen in both gravitational waves and light. Its glow came from freshly made heavy elements, such as gold and platinum.",
                    facts: [["First seen", "GW170817, August 2017"], ["Makes", "Heavy elements such as gold, platinum and uranium"], ["Result", "A heavier neutron star, or a black hole, which is what GW170817 probably made"]],
                    next: [{ to: "blackhole" }]
                },

                blackhole: {
                    art: "blackhole", image: "", imageAlt: "", imageCredit: "",
                    short: "Black hole", tag: "Stage 9 · Collapse complete", title: "Stellar-mass black hole",
                    text: "When a core is too heavy for even neutron pressure to hold, nothing stops the collapse. Inside the event horizon, not even light can escape. Seen from far away, it pulls like any object of the same mass. It is not a cosmic vacuum cleaner.",
                    facts: [["Forms from", "Core collapse, direct collapse or neutron-star mergers"], ["Typical mass", "A few to tens of Suns"], ["What we see", "Heated gas falling in, and gravitational waves from mergers"]],
                    next: [{ to: "hawking" }]
                },

                hawking: {
                    art: "hawking", image: "", imageAlt: "", imageCredit: "",
                    short: "Evaporation", tag: "Final · Theory", title: "Evaporation", aka: "Hawking radiation",
                    text: "Quantum effects at the horizon should make a black hole radiate faintly and slowly lose mass. Big black holes are colder and fade slowest. This has never been detected from a real black hole.",
                    facts: [["Predicted by", "Stephen Hawking, 1974"], ["Timescale", "About 10⁶⁷ years for a one-Sun black hole"], ["For scale", "The Universe is about 14 billion years old"], ["Open question", "What happens to the information that fell in"]],
                    end: "End of the line. If the theory holds, the black hole shrinks and ends in a final burst of radiation."
                }
            },

            sourcesNote: "Written from the sources below. Masses and timescales are approximate, and a few points (which stars explode, Hawking radiation, far-future decay) are still debated or theoretical.",
            sources: [
                { label: "NASA Science: Stars", url: "https://science.nasa.gov/stars/" },
                { label: "NASA Imagine the Universe: life cycles of stars", url: "https://imagine.gsfc.nasa.gov/educators/lifecycles/LC_main_p3.html" },
                { label: "NASA Imagine the Universe: neutron stars and pulsars", url: "https://imagine.gsfc.nasa.gov/science/objects/pulsars1.html" },
                { label: "Chandra: white dwarfs and the Chandrasekhar limit", url: "https://www.chandra.si.edu/edu/formal/stellar_ev/story/index7.html" },
                { label: "Chandra: massive stars and supernovae", url: "https://www.chandra.si.edu/edu/formal/stellar_ev/story/index11.html" },
                { label: "Chandra: brown dwarfs and low-mass stars", url: "https://www.chandra.si.edu/edu/formal/stellar_ev/story/index6.html" },
                { label: "NASA Goddard: Fermi and a magnetar-powered supernova", url: "https://svs.gsfc.nasa.gov/15041" },
                { label: "National Geographic: white dwarfs", url: "https://www.nationalgeographic.com/science/space/universe/white-dwarfs/" },
                { label: "Penn State Astro 801: neutron stars and pulsars", url: "https://courses.ems.psu.edu/astro801/book/export/html/1831" },
                { label: "Astronomy Now: maximum neutron star mass", url: "https://astronomynow.com/2021/03/22/gravitational-waves-hold-clues-about-maximum-neutron-star-mass/" },
                { label: "Brian Koberlein: A Quiet End (direct collapse)", url: "https://briankoberlein.com/blog/quiet-end/" },
                { label: "Universe Today: how supernovae fail", url: "https://www.universetoday.com/articles/how-do-supernovae-fail" },
                { label: "Astronomy magazine: can light escape from black holes?", url: "https://www.astronomy.com/science/can-light-escape-from-black-holes/" },
                { label: "Universe Today: Hawking-like decay of all objects (Radboud study)", url: "https://www.universetoday.com/articles/everything-in-the-universe-could-decay-from-hawking-radiation" }
            ]
        },

        strata: {
            title: "Strata",
            blurb: "Paleontology: reading deep time out of rock. Younger layers on top, older ones underneath. Hover a specimen to spin it, click to enlarge.",
            // orbit: camera angle "theta phi radius". exposure: 1 is normal. zoom: [closest, farthest].
            // shadow: 0 turns the floor shadow off. animate: false keeps the model still.
            layers: [
                {
                    era: "Miocene to Pliocene", name: "Megalodon tooth", color: "#C9A27A",
                    note: "Otodus megalodon swam from roughly 23 to 3.6 million years ago. Shark skeletons are cartilage and rarely fossilise, so teeth are most of what we have.",
                    model: {
                        src: "assets/models/megalodon-tooth.glb", poster: "", orbit: "", exposure: "1", zoom: ["60%", "220%"],
                        alt: "3D model of a fossil megalodon tooth, a broad triangle with serrated edges.",
                        title: "Megalodon Teeth Fossil", source: "https://skfb.ly/oWPBA",
                        author: "huykhoi2407", authorUrl: "https://sketchfab.com/huykhoi2407",
                        license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
                    }
                },

                {
                    era: "Amber fossil", name: "Mosquito in amber", color: "#B9855A",
                    note: "Resin buries small animals whole, down to wing veins and hairs. Mosquitoes are known from the Cretaceous onward. The Jurassic Park idea of cloning from them doesn't work, because DNA doesn't last that long.",
                    model: {
                        src: "assets/models/mosquito-amber.glb", poster: "", orbit: "", exposure: "2", zoom: ["70%", "180%"], shadow: 0,
                        alt: "3D model of a mosquito preserved inside a small chunk of amber.",
                        title: "Mosquito in amber", source: "https://skfb.ly/6xWCO",
                        author: "Loïc Norgeot", authorUrl: "https://sketchfab.com/norgeotloic",
                        also: { label: "Geoffrey Marchal", url: "https://sketchfab.com/geoffreymarchal" },
                        modified: "compressed for web, glass material added",
                        license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
                    }
                },

                {
                    era: "Cambrian", name: "Hallucigenia", color: "#8C5A3C",
                    note: "A worm-like animal with spines along its back. Early reconstructions got it upside down, taking the spines for legs. The name comes from hallucination.",
                    model: {
                        src: "assets/models/hallucigenia.glb", poster: "", orbit: "", exposure: "1", zoom: ["60%", "220%"], animate: false,
                        alt: "3D model of Hallucigenia, a worm-like Cambrian animal with paired spines along its back.",
                        title: "Hallucigenia Cambrian Animal", source: "https://skfb.ly/oWOTF",
                        author: "huykhoi2407", authorUrl: "https://sketchfab.com/huykhoi2407",
                        license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
                    }
                }
            ]
        },

        shelfTitle: "Also on the shelf",
        also: ["Psychology", "History", "Architecture", "Natural science", "A little chemistry"],
        mathNote: "Math and I are on a break.",
        howTitle: "How my attention works",
        howIWork: [
            "I try everything once. If it doesn't click, I drop it without guilt.",
            "If it does click, I go years deep, intensely, until I've worn it out.",
            "The result is a jack of many trades, and I'm at peace with that. New things keep pulling me in."
            // Optional: add a line here if you want to name a diagnosis publicly. That's your call.
        ]
    },

    /* ---------- 05 · PLAYER PROFILE ---------- */
    profile: {
        no: "05",
        title: "Player profile",
        blurb: "Pick a tab.",

        watch: {
            title: "Watch",
            split: [
                { label: "Cartoons, Anime/Manga, Light Novel", pct: 80 },
                { label: "Actual Movie", pct: 20 }
            ],
            note: "Roughly. Most of what I seek out on my own is anime, manga and cartoons. Live-action gets its turn too, I just don't go hunting for it as often.",
            genres: ["Sci-fi", "Adventure", "Mystery", "Psychological", "Horror", "Comedy", "Slice of life", "Drama", "Gore"]
        },

        play: {
            title: "Play",
            blurb: "One deck per kind of game. Tap a card to flip to the next game in that deck.",
            // icon: square image in assets/games/ (leave "" to show initials)
            groups: [
                {
                    title: "Deep stories", games: [
                        { name: "Hollow Knight", icon: "assets/games/hollow-knight.jpg" },
                        { name: "Hollow Knight Silksong", icon: "assets/games/silksong.jpg" },
                        { name: "Celeste", icon: "assets/games/celeste.jpg" },
                        { name: "Dead Cells", icon: "assets/games/dead-cells.jpg" },
                        { name: "Hyper Light Drifter", icon: "assets/games/hld.png" },
                    ]
                },
                {
                    title: "Main", games: [
                        { name: "FNAF series", icon: "assets/games/fnaf.jpg" },
                        { name: "Minecraft", icon: "assets/games/mc.png" },
                        { name: "OG Angry Birds Series", icon: "assets/games/angry-birds.jpg" },
                        { name: "Mekorama", icon: "assets/games/mekorama.png" },
                    ]
                },
                {
                    title: "Classic", games: [
                        { name: "Wordle", icon: "assets/games/wordle.png" },
                        { name: "Chess", icon: "assets/games/chess-com.jpg" },
                        { name: "Shiritori", icon: "assets/games/shiritori.jpg" },
                    ]
                },
                {
                    title: "Rhythm and arcade", games: [
                        { name: "Geometry Dash", icon: "assets/games/geometry-dash.jpg" },
                    ]
                },
                {
                    title: "Indie", games: [
                        { name: "Illusion Carnival", icon: "assets/games/illusion.png" },
                        { name: "Saihate Station", icon: "assets/games/saihate.jpg" },
                        { name: "Helltaker", icon: "assets/games/helltaker.jpg" },
                    ]
                },
                {
                    title: "Gacha", games: [
                        { name: "Zenless Zone Zero", icon: "assets/games/zzz.webp" },
                        { name: "Blue Archive", icon: "assets/games/ba.jpg" },
                        { name: "Arknights: Endfield", icon: "assets/games/akef.jpg" },
                        { name: "Nikke", icon: "assets/games/nikke.png" },
                        { name: "Wuthering Waves", icon: "assets/games/wuwa.webp" },
                    ]
                }
            ]
        },

        speak: {
            title: "Speak",
            blurb: "Level is out of 10, and it's an honest self-rating.",
            langs: [
                { name: "Indonesian", level: 10, label: "Native" },
                { name: "Regional languages", level: 3, label: "A little" },
                { name: "English", level: 6, label: "Intermediate" },
                { name: "Japanese", level: 3, label: "Learning", note: "OMW to N5." },
                { name: "Arabic", level: 2, label: "A few words" },
                { name: "German", level: 1, label: "A few words" },
            ]
        },

        side: {
            title: "Side quests",
            blurb: "Things I do rarely, and gladly.",
            groups: [
                { title: "Sport", items: ["Cycling", "Hiking", "Table tennis", "Archery"] },
                { title: "Music", items: ["No fixed genre. If it sounds good, it stays."] }
            ],
            note: "None of these are on a schedule. When the chance shows up, I'm in."
        }
    },

    /* ---------- 06 · CONTACT ---------- */
    contact: {
        no: "06",
        title: "Say hello.",
        blurb: "Email is the fastest way. Instagram works too. GitHub for my shenanigans.",
        links: [
            { kind: "email", label: "Email", value: "sashenkaosazee@gmail.com", href: "mailto:sashenkaosazee@gmail.com" },
            { kind: "github", label: "GitHub", value: "sashenkaze", href: "https://github.com/sashenkaze" },
            { kind: "instagram", label: "Instagram", value: "@shenka_aze", href: "https://instagram.com/shenka_aze" },
            { kind: "linkedin", label: "LinkedIn", value: "Profile on its way", soon: true }
        ]
    },

    /* ---------- MUSIC ----------
       Put the mp3 files in assets/music/ and list them here.
       file:   exact file name
       title / artist: shown on the player
       cover:  optional image in the same folder (leave "" for the default)
       Duration is read from the file automatically. */
    music: {
        folder: "assets/music/",
        tracks: [
            { file: "sealed-vessel.mp3", title: "Sealed Vessel (2nd Half)", artist: "Christopher Larkin", cover: "" }
            // , { file: "another-song.mp3", title: "Title", artist: "Artist", cover: "another.jpg" }
        ]
    }
};