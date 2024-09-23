const model = require("../models/model");

class Controller {

    getAll(req, res) {
        const data = model.getAll();
        res.send(model.getAll());
    }

    get(req, res) {
        const student = model.get(+req.params.id);
        if (student) {
            res.send(student);
        } else {
            res.status(404).send(`Resource with id ${req.params.id} not found.`);
        }
    }



    create = (req, res) => {
        /* Creates a new resources (the model assign an id) and sends it back to the client.
         * If something goes wrong, send back status code 404. 
         * Add the moment, no validation on the incoming data is made. This is always
         * necessary in a real-world project.
         */
        const student = req.body;
        // Validate incoming data
        if (!student.name || !student.age || typeof student.isGraduated === 'undefined' || !student.date) {
            return res.status(400).send('Invalid data. Name, age, graduation info, and date of birth are required.');
        }
        try {
            res.send(model.create(student));
        } catch (e) {
            res.status(404).send(`Error occured creating new student: ${e}`);
        }
    }

    update = (req, res) => {
        /* Updates a resource. If successful, sends back status 200. */
        const id = +req.params.id;
        const updatedData = req.body;

        const student = model.get(id);
        if (!student) {
            return res.status(404).send(`No resource with id ${id} exists. Update not possible.`);
        }

        if (!updatedData.name || typeof updatedData.age !== 'number' || typeof updatedData.isGraduated === 'undefined' || !updatedData.date) {
            return res.status(400).send('Invalid data. Name, age, graduation status, and date of birth are required.');
        }

        try {
            model.update(id, updatedData);
            res.sendStatus(200);
        } catch (e) {
            res.status(500).send(`Error occurred while updating student: ${e.message}`);
        }
    }

    delete(req, res) {
        /* Deletes the given resource from the model.Checks the incoming id first
         * After deleting the resource, sends back status 204. */
        const id = +req.params.id;
        const student = model.get(id);

        if (!student) {
            return res.status(404).send(`No resource with id ${id} exists. Delete not possible.`);
        }

        if (!model.get(id)) {
            res.status(404).send(`No student with id ${id} exists. Delete not possible.`);
        } else {
            model.delete(id);
            res.sendStatus(204);
        }
    }
}

module.exports = new Controller();