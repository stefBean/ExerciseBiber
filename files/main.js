/* A builder class to simplify the task of creating HTML elements */
class ElementCreator {
    constructor(tag) {
        this.element = document.createElement(tag);
    }

    id(id) {
        this.element.id = id;
        return this;
    }

    class(clazz) {
        this.element.class = clazz;
        return this;
    }

    text(content) {
        this.element.innerHTML = content;
        return this;
    }

    with(name, value) {
        this.element.setAttribute(name, value)
        return this;
    }

    listener(name, listener) {
        this.element.addEventListener(name, listener)
        return this;
    }

    append(child) {
        child.appendTo(this.element);
        return this;
    }

    prependTo(parent) {
        parent.prepend(this.element);
        return this.element;
    }

    appendTo(parent) {
        parent.append(this.element);
        return this.element;
    }

    insertBefore(parent, sibling) {
        parent.insertBefore(this.element, sibling);
        return this.element;
    }

    replace(parent, sibling) {
        parent.replaceChild(this.element, sibling);
        return this.element;
    }
}

/* A class representing a resource. This class is used per default when receiving the
   available resources from the server (see end of this file).
   You can (and probably should) rename this class to match with whatever name you
   used for your resource on the server-side.
 */
class Students {

    /* If you want to know more about this form of getters, read this:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get */
    get idforDOM() {
        return `student-${this.id}`;
    }

}

function add(student, sibling) {

    const creator = new ElementCreator("article")
        .id(student.idforDOM);


    /* Task 2: Instead of the name property of the example resource, add the properties of
       your resource to the DOM. If you do not have the name property in your resource,
       start by removing the h2 element that currently represents the name. For the 
       properties of your object you can use whatever html element you feel represents
       your data best, e.g., h2, paragraphs, spans, ... 
       Also, you don't have to use the ElementCreator if you don't want to and add the
       elements manually. */

    creator
        .append(new ElementCreator("h2").text(`${student.name} (Age: ${student.age})`))
        .append(new ElementCreator("p").text(`Graduated: ${student.isGraduated ? 'Yes' : 'No'}`))
        .append(new ElementCreator("p").text(`Date of Birth: ${student.date.toLocaleDateString()}`))

    creator
        .append(new ElementCreator("button").text("Edit").listener('click', () => {
            edit(student);
        }))
        .append(new ElementCreator("button").text("Remove").listener('click', () => {
            /* Task 3: Call the delete endpoint asynchronously using either an XMLHttpRequest
               or the Fetch API. Once the call returns successfully, remove the resource from
               the DOM using the call to remove(...) below. */
            fetch(`/api/students/${student.id}`, { method: 'DELETE' })
                .then(response => {
                    if(response.ok) {
                        remove(student);
                    }})
                .catch(() => alert("Error deleting resource"));
        }));

    const parent = document.querySelector('main');

    if (sibling) {
        creator.replace(parent, sibling);
    } else {
        creator.insertBefore(parent, document.querySelector('#bottom'));
    }
        
}

function edit(student) {
    const formCreator = new ElementCreator("form")
        .id(student.idforDOM)
        .append(new ElementCreator("h3").text(`Edit ${student.name}`));
    
    /* Task 4 - Part 1: Instead of the name property, add the properties your resource has here!
       The label and input element used here are just an example of how you can edit a
       property of a resource, in the case of our example property name this is a label and an
       input field. Also, we assign the input field a unique id attribute to be able to identify
       it easily later when the user saves the edited data (see Task 4 - Part 2 below). 
    */

    formCreator
        .append(new ElementCreator("label").text("Name").with("for", "student-name"))
        .append(new ElementCreator("input").id("student-name").with("type", "text").with("value", student.name))

        .append(new ElementCreator("label").text("Age").with("for", "student-age"))
        .append(new ElementCreator("input").id("student-age").with("type", "number").with("value", student.age))

        .append(new ElementCreator("label").text("Graduated").with("for", "student-isGraduated"))
        .append(new ElementCreator("input").id("student-isGraduated").with("type", "checkbox").with("checked", student.isGraduated))

        .append(new ElementCreator("label").text("Date of Birth").with("for", "student-date"))
        .append(new ElementCreator("input").id("student-date").with("type", "date").with("value", student.date.toISOString().split('T')[0]))

    /* In the end, we add the code to handle saving the resource on the server and terminating edit mode */
    formCreator
        .append(new ElementCreator("button").text("Speichern").listener('click', (event) => {
            /* Why do we have to prevent the default action? Try commenting this line. */
            event.preventDefault();

            /* The user saves the resource.
               Task 4 - Part 2: We manually set the edited values from the input elements to the resource object. 
               Again, this code here is just an example of how the name of our example resource can be obtained
               and set in to the resource. The idea is that you handle your own properties here.
            */
            student.name = document.getElementById("student-name").value;
            student.age = parseInt(document.getElementById("student-age").value);
            student.isGraduated = document.getElementById("student-isGraduated").checked;
            student.date = new Date(document.getElementById("student-date").value);



            /* Task 4 - Part 3: Call the update endpoint asynchronously. Once the call returns successfully,
               use the code below to remove the form we used for editing and again render 
               the resource in the list.
            */
            fetch(`/api/students/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            }).then(response => {
                if (response.ok) {
                    remove(student);
                    add(student, document.getElementById(student.idforDOM));
                } else {
                    alert("Error updating student.");
                }
            }).catch(() => alert("Error updating student."));
        }))
        .replace(document.querySelector('main'), document.getElementById(student.idforDOM));
}

function remove(student) {
    document.getElementById(student.idforDOM).remove();
}

/* Task 5 - Create a new resource is very similar to updating a resource. First, you add
   an empty form to the DOM with the exact same fields you used to edit a resource.
   Instead of PUTing the resource to the server, you POST it and add the resource that
   the server returns to the DOM (Remember, the resource returned by the server is the
    one that contains an id).
 */
function create() {
    // alert("Not implemented yet!");
    const formCreator = new ElementCreator("form")
        .append(new ElementCreator("h3").text("Create New Student"));

    // Task 5: Create form inputs for new student.
    formCreator
        .append(new ElementCreator("label").text("Name").with("for", "new-student-name"))
        .append(new ElementCreator("input").id("new-student-name").with("type", "text"))

        .append(new ElementCreator("label").text("Age").with("for", "new-student-age"))
        .append(new ElementCreator("input").id("new-student-age").with("type", "number"))

        .append(new ElementCreator("label").text("Graduated").with("for", "new-student-isGraduated"))
        .append(new ElementCreator("input").id("new-student-isGraduated").with("type", "checkbox"))

        .append(new ElementCreator("label").text("Date of Birth").with("for", "new-student-date"))
        .append(new ElementCreator("input").id("new-student-date").with("type", "date"))

        // Handle form submission for creating a new student.
        .append(new ElementCreator("button").text("Create").listener('click', (event) => {
            event.preventDefault();

            const newStudent = {
                name: document.getElementById("new-student-name").value,
                age: parseInt(document.getElementById("new-student-age").value),
                isGraduated: document.getElementById("new-student-isGraduated").checked,
                date: new Date(document.getElementById("new-student-date").value)
            };

            // Send POST request to create the student.
            fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudent)
            }).then(response => response.json())
                .then(createdStudent => {
                    add(Object.assign(new Students, createdStudent));
                }).catch(() => alert("Error creating student."));
        }));
}
    

document.addEventListener("DOMContentLoaded", function (event) {

    fetch("/api/students")
        .then(response => response.json())
        .then(student => {
            for (const student of student) {
                add(Object.assign(new Students(), student));
            }
        });
});

