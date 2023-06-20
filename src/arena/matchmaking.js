import {app} from "../server.js";
import {supabase} from "../lib/supabase.js";
import {jsonParser} from "../server.js";

const aPlayer = {
    id: '742e71f1-7b15-4255-8c53-4b1f987ae9e5',
    created_at: '2023-06-14T18:34:05.094039+00:00',
    name: 'sven svärd',
    level: 1,
    experience: 0,
    max_health: 20,
    current_health: 20,
    strength: 5,
    agility: 5,
    owner: '5e1b7c00-f43b-48b1-99e4-aca0fea5736d',
    levelRange: 3
}


const queue = [aPlayer]

export const matchPing = () => {
    app.get('/match-ping', jsonParser, async (req, res) => {
        // console.log("id", req.query.id)
        // console.log(queue)

        if (queue.find(e => e.owner === req.query.id)) {
            res.json({status: true})
        } else {
            res.json({status: false})
        }
    })
}

export const matchmaking = () => {
    app.post('/search-duel', jsonParser, async (req, res) => {
        console.log(req.body)

        if (!queue.find(e => e.owner === req.body.id)) {
            let {error, data: character} = await supabase
                .from('characters')
                .select()
                .eq('owner', await req.body.id)
                .limit(1)
                .single()


            if (!error) {
                character.levelRange = 3
                queue.push(character)

                //TODO: add matchmaking

                const players = matchPlayers(queue)

                if(players) {
                    generateDuel(players).then(res => {
                        console.log("report:", res)
                    })
                }
            }

            res.status(200).json({foundCharacter: character})
        } else {
            res.status(200).json({hejsan: "already in queue", status: 0})
        }
    })
}







// Function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to match players within the specified level range
function matchPlayers(players) {
    shuffleArray(players); // Shuffle the players array

    for (let i = 0; i < players.length; i++) {
        const playerA = players[i];

        for (let j = i + 1; j < players.length; j++) {
            const playerB = players[j];

            const levelDifference = Math.abs(playerA.level - playerB.level);

            if (levelDifference <= playerA.levelRange && levelDifference <= playerB.levelRange) {
                return [playerA, playerB]; // Return the first match found
            }
        }
    }

    return null; // Return null if no match is found
}

const generateDuel = async (players) => {

    console.log("generating duel")

    const linked = []



    const {error, data} = await supabase
        .from('battle_reports')
        .insert(
            {
                report: {
                    winner: players[0],
                    loser: players[1],
                    report: {"text": "omg " + players[0].name + " won with a big margin!"},
                    rewards: ['apple', '2 copper coins', 'loincloth']
                }
            }
        )
        .select()
        .limit(1)
        .single()

    for(let player in players) {
        linked.push({character: players[player].id, battle_report: data.id})
    }

    console.log("linked", linked)

    console.log()

    const {e, d} = await supabase
        .from('characters_battle_reports')
        .insert(linked)
        .select()

    console.log("duel error:", error)
    console.log("duel data:", data)

    console.log("linked error:", e)
    console.log("linked data:", d)

    // return {
    //     winner: players[0],
    //     loser: players[1],
    //     report:
    //         {
    //             "text": "omg " + players[0].name + " won with a big margin!"
    //         },
    //     rewards: ['apple', '2 copper coins', 'loincloth']
    // }
}