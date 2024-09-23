/* A class representing your resource. At the moment, its name is Resource. But you
   can (and probalby should) rename it to whatever you are going to use as a Resource.
   At the moment the example resource has only a name. You can delete this property
   if you don't need it.

   Task 1 - Part 1: Replace the Resource class with a new class of your choosing, that
   has at least three properties: one string property, one number property, one boolean
   property, and - optionally - a date property.
   Then, adapt the initialization of the data at the end of this file (Task 2 - Part 2)
   so that you have some instances of your object available that can be served to the client.
 */
class Students {
    constructor(name, age, isGraduated, date) {
        this.name = name;
        this.age = age;
        this.isGraduated = isGraduated;
        this.date = date;
    }
}

/* A model managing a map of resources. The id of the object is used as key in the map. */
class Model {
    static ID = 1;

    constructor() {
        this.student = new Map();
    }

    add(student) {
        student.id = Model.ID++;
        this.student.set(student.id, student);
    }

    get(id) {
        this.checkId(id);
        return this.student.get(id);
    }

    getAll() {
        return Array.from(this.student.values());
    }

    checkId(id) {
        if (typeof id !== "number") {
            throw new Error(`Given id must be an number, but is a ${typeof id}`);
        }
    }

    create(student) {
        this.add(student);
        return student;
    }

    update(id, studentData) {
        this.checkId(id);

        const target = this.student.get(id);
        if (!target) {
            throw new Error(`Resource with ${id} does not exist and cannot be updated.`)
        }

        Object.assign(target, studentData);

        return target;
    }

    delete = (id) => {
        this.checkId(id);
        return this.student.delete(id);
    }
}

const model = new Model();

/* Task 1 - Part 2. Replace these three instances of the example Class Resource with instances
   of your own class */
model.add(new Students("Stef",32,true, new Date("1992-01-02")));
model.add(new Students("Lukas",24,true, new Date("2000-03-11")));
model.add(new Students("Anna-Pia",27,false, new Date("1996-10-22")));

module.exports = model;
