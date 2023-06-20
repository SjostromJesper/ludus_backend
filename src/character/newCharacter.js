import {app, jsonParser} from "../server.js";
import {supabase} from "../lib/supabase.js";

export const newCharacter = () => {
    app.post('/new-character', jsonParser, async (req, res) => {
        // console.log("id", req.query.id)
        // console.log(queue)

        console.log(req.body)

        const total = 10
        let amount = 0
        for(let attribute in req.body.attributes) {
            amount += req.body.attributes[attribute]
        }
        if(amount === total) {
            console.log("is perfect")
        }
        else {
            console.log("is wrong! not enough or too many points spent.")
        }

        console.log(`${amount}/${total}`)

        res.send({status: "bollybollybill"})

        // const { data: characterData, error: createCharacterError } = await supabase
        //     .from('characters')
        //     .insert(
        //         {
        //             name: formData.get('name'),
        //             level: 1,
        //             experience: 0,
        //             max_health: 20,
        //             current_health: 20,
        //             strength: 5,
        //             agility: 5,
        //             owner: formData.get('id')
        //         }
        //     )
        //     .select()
        //     .limit(1)
        //     .single()
        //
        // const {error: userError} = await supabase
        //     .from('users')
        //     .update({character: characterData.id})
        //     .select()
        //     .eq('id', formData.get('id'))
        //
        //
        // console.log(createCharacterError)
        // console.log(userError)




    })
}