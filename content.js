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

    /* ---------- 03 · FIELD NOTES ---------- */
    notes: {
        no: "03",
        title: "Field notes",
        blurb: "What I read, watch and wonder about when nobody is grading it.",

        sky: {
            title: "Sky",
            blurb: "Astronomy is where my long-distance thinking starts. Orion is a good place to begin.",
            // x, y: position in a 300x340 box. r: dot size.
            stars: [
                { name: "Betelgeuse", kind: "Red supergiant", x: 90, y: 50, r: 5.5, note: "One of the largest stars you can see with the naked eye. It marks Orion's shoulder, and one day it will end as a supernova." },
                { name: "Bellatrix", kind: "Blue giant", x: 210, y: 60, r: 3.5, note: "The other shoulder. Its name is Latin for 'female warrior'." },
                { name: "Alnitak", kind: "Belt star", x: 115, y: 165, r: 3.5, note: "The eastern end of Orion's belt. The three belt stars are the easiest way to find the whole constellation." },
                { name: "Alnilam", kind: "Belt star", x: 150, y: 160, r: 4, note: "The middle of the belt, a blue supergiant that is much farther away than its neighbours suggest." },
                { name: "Mintaka", kind: "Belt star", x: 185, y: 155, r: 3.5, note: "The western end of the belt. It sits almost exactly on the celestial equator." },
                { name: "Saiph", kind: "Supergiant", x: 95, y: 285, r: 3.5, note: "Orion's other foot. Easy to overlook, though it is intrinsically very luminous." },
                { name: "Rigel", kind: "Blue supergiant", x: 220, y: 280, r: 5, note: "Far hotter and bluer than the Sun, and one of the brightest stars in the night sky. It marks Orion's foot." }
            ],
            // pairs of star indexes to connect
            lines: [[0, 2], [1, 4], [0, 1], [2, 3], [3, 4], [2, 5], [4, 6]]
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

    /* ---------- 04 · PLAYER PROFILE ---------- */
    profile: {
        no: "04",
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
                        { name: "Undertale", icon: "assets/games/undertale.png" },
                        { name: "Celeste", icon: "assets/games/celeste.jpg" },
                        { name: "Ori and the Blind Forest", icon: "assets/games/ori.webp" },
                        { name: "Dead Cells", icon: "assets/games/dead-cells.jpg" },
                        { name: "Hyper Light Drifter", icon: "assets/games/hld.png" },
                    ]
                },
                {
                    title: "Main", games: [
                        { name: "FNAF series", icon: "assets/games/fnaf.jpg" },
                        { name: "Minecraft", icon: "assets/games/mc.png" },
                        { name: "OG Angry Birds Series", icon: "assets/games/angry-birds.jpg" },
                    ]
                },
                {
                    title: "Classic", games: [
                        { name: "Wordle", icon: "assets/games/wordle.png" },
                        { name: "Chess", icon: "assets/games/chess-com.jpg" },
                    ]
                },
                {
                    title: "Rhythm and arcade", games: [
                        { name: "Geometry Dash", icon: "assets/games/geometry-dash.jpg" },
                        { name: "Osu", icon: "assets/games/osu.png" },
                        { name: "A Dance of Fire and Ice", icon: "assets/games/adofai.png" },
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
                        { name: "Zenless Zone Zero", main: true, icon: "assets/games/zzz.webp" },
                        { name: "Blue Archive", icon: "assets/games/ba.jpg" },
                        { name: "Arknights: Endfield", icon: "assets/games/akef.jpg" },
                        { name: "Nikke", icon: "assets/games/nikke.png" },
                        { name: "Wuthering Waves", icon: "assets/games/wuwa.webp" },
                        { name: "Limbus Company", icon: "assets/games/limbus.jpg" },
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
                { title: "Sport", items: ["Cycling", "Table tennis", "Archery"] },
                { title: "Music", items: ["No fixed genre. If it sounds good, it stays."] }
            ],
            note: "None of these are on a schedule. When the chance shows up, I'm in."
        }
    },

    /* ---------- 05 · CONTACT ---------- */
    contact: {
        no: "05",
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