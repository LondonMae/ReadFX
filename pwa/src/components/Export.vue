<script set up>

// const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017")

// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/test');

//     const noteSchema = new mongoose.Schema({
//         note: String
//     });
//     const Note = mongoose.model('Note', noteSchema);
//     // const wiki_notes = new Note {{name: 'Wiki Notes'}};
//     const wifi_note = new Note({ name: 'wifi_note' });
//     console.log(wifi_note.name);
//     await wifi_note.save();



    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }



function handleSaveNote() {
    alert('Invoke Save notes');
    main();

}



</script>

<template>

    <button class="button" onclick="handleSaveNote">Save Note</button>

</template>

<style scope>
.button {
    color: black;
    background-color: #619f78;
    margin-top: 25px;
}
</style>