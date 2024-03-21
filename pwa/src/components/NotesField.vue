<template>
    <div id="app">
        <div v-for="field in fields" :key="field.id" class="editable-field">
            <template v-if="editedFieldId === field.id">
                <input type="text" v-model="field.value" :ref="`field${field.id}`" />

                <button class="btn" @click.prevent="toggleEdit">
                    <template>Save</template>
                </button>
            </template>
            <template v-else>
                <span>
                    {{ field.value }}
                </span>

                <button class="btn" @click.prevent="toggleEdit(field.id)"> Edit</button>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            editedFieldId: null,
            fields: [
                {
                    id: 1,
                    value: "Note 1  ",
                },
                {
                    id: 2,
                    value: "Note 2  ",
                },
                {
                    id: 3,
                    value: "Note 3  ",
                },
                {
                    id: 4,
                    value: "Note 4  ",
                },
            ],
        };
    },
    methods: {
        toggleEdit(id) {
            if (id) {
                this.editedFieldId = id;
                this.$nextTick(() => {
                    if (this.$refs["field" + id]) {
                        this.$refs["field" + id][0].focus();
                    }
                });
            } else {
                this.editedFieldId = null;
            }
        },
    },
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    font-weight: bold;
    font-size: 20px;
}

.editable-field {
    margin: 10px 0;
}

.editable-field input,
.editable-field button {
    border: 1px solid #4c4c4c;
    background-color: #fff;
    padding: 4px 6px;
    font-size: 18px;
}
</style>