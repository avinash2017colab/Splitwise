let people = [];
let products = [];

function addPerson() {
    const personName = document.getElementById("personName").value;
    if (personName.trim() !== "") {
        people.push(personName);
        updatePeopleTable();
        document.getElementById("personName").value = "";
        updateSharedWithCheckboxes();
    }
}

function removePerson(person) {
    people = people.filter(p => p !== person);
    updatePeopleTable();
    updateSharedWithCheckboxes();
}

function updatePeopleTable() {
    const peopleTable = document.getElementById("peopleTable");
    peopleTable.innerHTML = "";
    people.forEach(person => {
        const row = peopleTable.insertRow();
        const cell1 = row.insertCell(0);
        cell1.textContent = person;
        const cell2 = row.insertCell(1);
        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.onclick = () => removePerson(person);
        cell2.appendChild(removeButton);
    });
}

function addProduct() {
    const productName = document.getElementById("productName").value;
    const productCost = parseFloat(document.getElementById("productCost").value);
    const sharedWithCheckboxes = document.getElementsByName("sharedWithCheckbox");
    const sharedWith = Array.from(sharedWithCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    if (productName.trim() !== "" && !isNaN(productCost) && productCost > 0 && sharedWith.length > 0) {
        products.push({ name: productName, cost: productCost, sharedWith: sharedWith });
        updateProductsTable();
        updateTotalCost();
        document.getElementById("productName").value = "";
        document.getElementById("productCost").value = "";
        clearCheckboxSelection(sharedWithCheckboxes);
    }
}

function removeProduct(productName) {
    products = products.filter(product => product.name !== productName);
    updateProductsTable();
    updateTotalCost();
}

function updateProductsTable() {
    const productsTable = document.getElementById("productsTable");
    productsTable.innerHTML = "";

    products.forEach(product => {
        const row = productsTable.insertRow();
        const cell1 = row.insertCell(0);
        cell1.textContent = product.name;
        const cell2 = row.insertCell(1);
        cell2.textContent = product.sharedWith.join(', ');
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.onclick = () => removeProduct(product.name);
        cell3.appendChild(removeButton);

        const individualPrice = product.cost / product.sharedWith.length;
        cell4.textContent = `$${individualPrice.toFixed(2)}`;
    });
}

function updateTotalCost() {
    const totalCost = products.reduce((acc, product) => acc + product.cost, 0);
    document.getElementById("totalCost").textContent = `$${totalCost.toFixed(2)}`;
}

function updateSharedWithCheckboxes() {
    const sharedWithGroup = document.getElementById("sharedWith");
    sharedWithGroup.innerHTML = "";

    people.forEach(person => {
        const checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("custom-checkbox");

        const checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.name = "sharedWithCheckbox";
        checkboxInput.value = person;

        const checkboxLabel = document.createElement("label");
        checkboxLabel.textContent = person;

        checkboxDiv.appendChild(checkboxInput);
        checkboxDiv.appendChild(checkboxLabel);

        sharedWithGroup.appendChild(checkboxDiv);
    });

    // Add a checkbox for "Everyone"
    const everyoneDiv = document.createElement("div");
    everyoneDiv.classList.add("custom-checkbox");

    const everyoneInput = document.createElement("input");
    everyoneInput.type = "checkbox";
    everyoneInput.name = "sharedWithCheckbox";
    everyoneInput.value = "Everyone";

    const everyoneLabel = document.createElement("label");
    everyoneLabel.textContent = "Everyone";

    everyoneInput.addEventListener('change', function() {
        const checkboxes = document.getElementsByName("sharedWithCheckbox");
        checkboxes.forEach(checkbox => {
            checkbox.checked = everyoneInput.checked;
        });
    });

    everyoneDiv.appendChild(everyoneInput);
    everyoneDiv.appendChild(everyoneLabel);

    sharedWithGroup.appendChild(everyoneDiv);
}

function clearCheckboxSelection(checkboxGroup) {
    checkboxGroup.forEach(checkbox => checkbox.checked = false);
}

function calculateBills() {
    const billsTable = document.getElementById("billsTable");
    billsTable.innerHTML = "";

    people.forEach(person => {
        const row = billsTable.insertRow();
        const cell1 = row.insertCell(0);
        cell1.textContent = person;
        const cell2 = row.insertCell(1);

        // Calculate the total cost shared with the person
        const personShare = products.reduce((acc, product) => {
            const recipients = Array.from(new Set(product.sharedWith.filter(person => person !== "Everyone")));
            const numberOfRecipients = recipients.length;

            // Check if the person is in the recipients list
            if (recipients.includes(person) || (numberOfRecipients === people.length && product.sharedWith.includes("Everyone"))) {
                // Add the share to the accumulator
                return acc + (product.cost / numberOfRecipients);
            }

            return acc;
        }, 0);

        // Display the calculated share for the person
        cell2.textContent = `$${personShare.toFixed(2)}`;
    });
}

function printPage() {
    window.print();
}
