/*
Write in format:
    [
        "playlist name",
        "image name",
        "url",
        "tags"
    ]

Notes:
- All names and tags will be turned lowercase. No case sensitivity
- Images need to be have ".png" at the end. Doesn't have to be an actual png file, it's just the name
- Separate tags by commas (eg: "tag1", "tag2" )
*/

// ONLY CHANGE TXT BELOW HERE:

let playlistData = [
    [
        "lofi hip hop", 
        "1",
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFtx8H66zvlyVVNBOed_92KC",
        "relax", "uplift"
    ],
    [
        "synth",
        "3",
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFuBZ781wgy_Ue8kTfxGhY5q",
        "relax"
    ],
    [
        "study collections", 
        "study", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFu_HnFLy3a9nmT7UXHU-blH", 
        "relax"
    ],
    [
        "alec benjamin", 
        "19", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFt3C2RVaEKnogcfLB98zt6J", 
        "eng", "vocal"
    ], 
    [
        "nier piano", 
        "nier", 
        "https://www.youtube.com/playlist?list=PL272DB9874D2C22EB", 
        "game ost", "piano"
    ],
    [
	"dead cells", 
	"dead-cells", 
	"https://www.youtube.com/playlist?list=PLIggG_1k5RFuHngkyMalynUmzAjSekqq3",
	"game ost", "hype"
    ],
    [
        "hype", 
        "16", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFsZ4It7zvlG1ac5-Xfv9JBb", 
        "hype"
    ], 
    [
	"anime related",
	"10",
	"https://www.youtube.com/playlist?list=PLIggG_1k5RFu3wJDcasSzpQO1Kw0uONXx",
	"vocal", "jap"
    ],
    [
	"devilman crybaby",
	"11",
	"https://www.youtube.com/playlist?list=PLIggG_1k5RFsAo8VJ_TQMbOj0F4MR1eOy",
	"instrumental"
    ],
    [
	"hige dandism", 
	"5", 
	"https://www.youtube.com/playlist?list=PLIggG_1k5RFuhuJ0kRBdv8AJAMIoYvDvj", 
	"jap", "vocal"
    ],
    [
	"reaffirm", 
	"12", 
	"https://www.youtube.com/playlist?list=PLIggG_1k5RFuLAlbhlgGPEFOCezdiMo8F", 
	"moody", "instrumental"
    ],
    [
        "katana zero", 
        "kz1", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFvYTQ4NQqcrVgYwpVVpu8q2", 
        "game ost"
    ],
    [
        "katana zero relax", 
        "kz2", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFvTSAivNMNu-7Nz94uLTRTB", 
        "game ost", "relax"
    ], 
    [
        "katana zero hype", 
        "kz3", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFuus2szG7DCzUqNrradv9hM", 
        "game ost", "hype"
    ], 
    [
        "maretu", 
        "7", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFum3ZcEzIEiwsE6CfiwFd5r", 
        "jap", "vocal"
    ], 
    [
        "hotline miami", 
        "hlm", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFt31wDj3YvmUmBus2ExYgpu", 
        "game ost"
    ],
    [
        "reject", 
        "14", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFvgotAWd1nQF0URzgt1scyM", 
        "moody"
    ],
    [
        "carpenter brut", 
        "13", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFuaCYtW3Z_BA3oPAMc7YQ4w", 
        "hype", 
        "hype"
    ], 
    [
        "uplift", 
        "4", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFt-cY___RNiRHEcyWskdQwc", 
        "uplift"
    ], 
    [
        "hollow knight", 
        "hk1", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFsn_UmyQWUYTXeeR8ykwfh4", 
        "game ost", "relax"
    ],
    [
        "hollow knight piano", 
	"hk2", 
        "https://www.youtube.com/playlist?list=PLczA8pMWxlsFUFEtlc6MuucBX-OmKPKkN", 
        "game ost", 
        "game ost", "piano"
    ],
    [
        "celeste", 
        "celeste", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFth7R-_oQmQFTzzbvId_tJe", 
        "game ost", "uplift"
    ], 
    [
        "ayase / yoasobi", 
        "8", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFvXaKt2z8yNwXU2IYBDWHct", 
        "jap", "uplift", "vocal"
    ], 
    [
        "regret", 
        "6", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFtMW9QbNVFO5VGlKPg4jjwd", 
	"moody"
    ],
    [
        "omori relax", 
        "omori1", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFsliPhflyCoyOQj_0zuviOU", 
        "game ost", "relax"
    ], 
    [
        "omori hype", 
        "omori2", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFtHHPjhvaLtxZAMGcdxg_VA", 
        "game ost", "hype"
    ], 
    [
        "lazy afternoons", 
        "17", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFsk3SU-B00c9b5481uMcUyO", 
        "relax"
    ], 
    [
        "granblue fantasy", 
        "gbf", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFvbbfgdFR9U0I5icHTp8qif", 
        "game ost"
    ],
    [
        "mili", 
        "2", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFum7Xj5gXobDZ6g6fsCO8B2", 
        "jap", "eng", "vocal"
    ], 
    [
        "jubyphonic", 
        "9", 
        "https://www.youtube.com/playlist?list=PLIggG_1k5RFuL9UVFx7LwKytS9Q5iptbJ", 
        "eng", "vocal"
    ]
];