const id = 1

const arr = [{id: 1}, {id: 123242142}, {id: 657562372}, {id: 123675321264323}]
if(arr.includes(1)) {
    console.log("has it!")
}


if (arr.find(e => e.id === 123675324323)) {
    /* same result as above, but a different function return type */
    console.log("found it!")
}