const express = require("express");

const app = express();

let bands = [
    {
        id: 1,
        name: "Linkin Park",
        musics: [],
        gender: "Nu Metal",
    },
    {
        id: 2,
        name: "Metallica",
        musics: [],
        gender: "Trash Metal",
    },
];

let favorites = [];
let genders = [];
let musics = [];

app.use(express.json());

app.get("/health", (request, response) => {
    return response.json({
        message: "OK",
    });
});

app.get("/bands", (request, response) => {
    return response.status(200).json(bands);
});

app.get("/favorites", (request, response) => {
    return response.status(200).json(favorites);
});

app.get("/genders", (request, response) => {
    return response.status(200).json(genders);
});

app.get("/musics", (request, response) => {
    return response.status(200).json(musics);
});

app.post("/bands", (request, response) => {
    const { name } = request.body;

    if (!name) {
        return response.status(400).json({ error: "Name not given." });
    }

    bands.push({
        id: getLastId(bands) + 1,
        name,
        musics: [],
        gender: "",
    });

    return response.status(200).json({ message: "Band created succesfully." });
});

app.delete("/bands/:id", (request, response) => {
    const { id } = request.params;

    const findBandById = bands.findIndex((band) => band.id == id);

    if (findBandById === -1) {
        return response.status(404).json({ message: "Band not found." });
    }

    bands = bands.filter((band) => band.id != id);

    return response.status(200).json({ message: "Band deleted successfully." });
});

app.post("/favorites", (request, response) => {
    const { bandId } = request.body;

    const findBandById = bands.findIndex((band) => band.id == bandId);
    const bandAlreadyExists = favorites.some((band) => band.id == bandId);

    if (findBandById === -1) {
        return response.status(404).json({ message: "Band not found." });
    }

    if (!bandAlreadyExists) {
        const bandToCopy = bands.find((band) => band.id == bandId);

        if (bandToCopy) {
            favorites.push({ ...bandToCopy });
        }

        return response
            .status(200)
            .json({ message: "Band created succesfully" });
    }

    return response
        .status(403)
        .json({ message: "Band has already been added to Favorites." });
});

app.delete("/favorites/:id", (request, response) => {
    const { id } = request.params;

    const findBandById = favorites.findIndex((band) => band.id == id);

    if (findBandById === -1) {
        return response.status(404).json({ message: "Band not found." });
    }

    favorites = favorites.filter((band) => band.id != id);

    return response
        .status(200)
        .json({ message: "Band successfully deleted from Favorites." });
});

app.post("/genders", (request, response) => {
    const { bandId, musicalGender } = request.body;

    if (!musicalGender) {
        return response.status(400).json({ error: "Gender is required." });
    }

    const findBandById = bands.findIndex((band) => band.id == bandId);

    if (findBandById === -1) {
        return response.status(404).json({ message: "Band not found." });
    }

    bands[findBandById].gender = musicalGender;

    function groupByGender(bands) {
        return bands.reduce((accumulator, currentBand) => {
            if (!accumulator[currentBand.gender]) {
                accumulator[currentBand.gender] = [];
            }
            accumulator[currentBand.gender].push(currentBand);
            return accumulator;
        }, {});
    }

    genders = groupByGender(bands);

    return response.status(200).json({
        message: "Genre added to band and band(s) added to genre list.",
    });
});

app.post("/musics", (request, response) => {
    const { bandId, name } = request.body;

    if (!name) {
        return response.status(400).json({ error: "Music name is required." });
    }

    const findBandById = bands.findIndex((band) => band.id == bandId);

    if (findBandById === -1) {
        return response.status(404).json({ message: "Band not found." });
    }

    const allMusicIds = [];

    bands.forEach((band) => {
        band.musics.forEach((music) => {
            allMusicIds.push({
                id: music.id,
            });
        });
    });

    let music = {
        id: getLastId(allMusicIds) + 1,
        name,
        likes: 0,
    };

    bands[findBandById].musics.push(music);

    function groupByBand(bands) {
        return bands.reduce((accumulator, currentBand) => {
            if (!accumulator[currentBand.name]) {
                accumulator[currentBand.name] = [];
            }
            accumulator[currentBand.name].push(currentBand.musics);
            return accumulator;
        }, {});
    }

    musics = groupByBand(bands);

    return response.status(200).json({ message: "Music created succesfully." });
});

app.post("/likes", (request, response) => {
    const { bandId, musicId } = request.body;

    if (!musicId) {
        return response.status(400).json({ error: "Music ID is required." });
    }

    const findBandById = bands.findIndex((band) => band.id == bandId);
    const findMusicById = bands[findBandById].musics.findIndex(
        (music) => music.id == musicId
    );

    if (findBandById === -1) {
        return response.status(404).json({ message: "Band not found." });
    }

    bands[findBandById].musics[findMusicById].likes =
        bands[findBandById].musics[findMusicById].likes + 1;

    return response.status(200).json({ message: "Like given successfully." });
});

function getLastId(list) {
    let lastId = 0;

    list.forEach((item) => {
        if (item.id > lastId) {
            lastId = item.id;
        }
    });

    return lastId;
}

app.listen(3333, () => {
    console.log("Server started on port: 3333");
});
