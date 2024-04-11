$(document).ready(function () {
    // Reload trainings data
    function reloadTrainings() {
        getTrainings();
    }

    // Call reloadTrainings when the page is loaded or refreshed
    reloadTrainings();

    // Get all trainings from the API and display them
    function getTrainings() {
        $.ajax({
            url: 'https://6608ce75a2a5dd477b14c598.mockapi.io/FEBC/trainings',
            method: 'GET',
            success: function (data) {
                displayTrainings(data);
            }
        });
    }

    // Display trainings in the list
    function displayTrainings(trainings) {
        $('#trainingsList').empty();
        trainings.forEach(function (training) {
            $('#trainingsList').append(`
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${training.name}</h5>
                        <p class="card-text">Date: ${training.date}</p>
                        <p class="card-text">Trainer: ${training.trainer}</p>
                        <button class="btn btn-warning mr-2" onclick="editTraining(${training.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteTraining(${training.id})">Delete</button>
                    </div>
                </div>
            `);
        });
    }

    // Add a new training
    $('#trainingForm').submit(function (event) {
        event.preventDefault();
        var name = $('#name').val();
        var date = $('#date').val();
        var trainer = $('#trainer').val();

        // Check if the training already exists
        if (isTrainingExists(name, date, trainer)) {
            alert("This entry already exists.");
            return;
        }

        $.ajax({
            url: 'https://6608ce75a2a5dd477b14c598.mockapi.io/FEBC/trainings',
            method: 'POST',
            data: {
                name: name,
                date: date,
                trainer: trainer
            },
            success: function () {
                getTrainings();
                $('#name').val('');
                $('#date').val('');
                $('#trainer').val('');
            }
        });
    });

// If the training already exists
function isTrainingExists(name, date, trainer) {
    var trainings = $('#trainingsList').find('.card-title');
    var exists = false;
    trainings.each(function () {
        var existingName = $(this).text().trim();
        var existingDate = $(this).siblings('.card-text').eq(0).text().trim().split(": ")[1];
        var existingTrainer = $(this).siblings('.card-text').eq(1).text().trim().split(": ")[1];
        if (existingName === name && existingDate === date && existingTrainer === trainer) {
            exists = true;
            return false; // Break out of the loop
        }
    });
    return exists;
}


    // Delete a training
    window.deleteTraining = function (id) {
        // Display a confirmation dialog before deleting
        if (confirm("Are you sure you want to delete this entry?")) {
            $.ajax({
                url: `https://6608ce75a2a5dd477b14c598.mockapi.io/FEBC/trainings/${id}`,
                method: 'DELETE',
                success: function () {
                    getTrainings();
                }
            });
        }
    };


    // Populate form fields for editing
    window.editTraining = function (id) {
        $.ajax({
            url: `https://6608ce75a2a5dd477b14c598.mockapi.io/FEBC/trainings/${id}`,
            method: 'GET',
            success: function (data) {
                $('#name').val(data.name);
                $('#date').val(data.date);
                $('#trainer').val(data.trainer);
                
                // Remove existing update button and training ID input field
                $('#updateBtn').remove();
                $('#trainingId').remove();
                
                // Append new update button
                $('#trainingForm').append('<input type="hidden" id="trainingId" value="' + data.id + '">');
                $('#trainingForm').append('<button class="btn btn-success mt-2" id="updateBtn">Update</button>');
                $('#updateBtn').click(function () {
                    updateTraining(data.id);
                });
            }
        });
    };



    // Update a training
    function updateTraining(id) {
        var name = $('#name').val();
        var date = $('#date').val();
        var trainer = $('#trainer').val();
        
        // Retrieve the existing date from the form if no new date is provided
        if (date === "") {
            date = $('#date').attr('data-existing-date');
        }

        $.ajax({
            url: `https://6608ce75a2a5dd477b14c598.mockapi.io/FEBC/trainings/${id}`,
            method: 'PUT',
            data: {
                name: name,
                date: date,
                trainer: trainer
            },
            success: function () {
                getTrainings();
                $('#name').val('');
                $('#date').val('');
                $('#trainer').val('');
                $('#trainingId').remove();
                $('#updateBtn').remove();
            }
        });
    }


    // Initial load of training information
    getTrainings();
});
