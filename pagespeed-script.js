jQuery(document).ready(function ($) {
    $('#pagespeed-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Show spinner
        $('#pagespeed-spinner').show();

        var url = $('#url').val();
        var apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + encodeURIComponent(url);

        // Make AJAX request to fetch PageSpeed Insights data
        $.ajax({
            url: apiUrl,
            dataType: 'json',
            success: function (data) {
                // Hide spinner
                $('#pagespeed-spinner').hide();

                displayPageSpeedData(data); // Call function to display data
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data:', error);

                // Hide spinner
                $('#pagespeed-spinner').hide();

                $('#pagespeed-results').html('<p class="error-message">Error retrieving data from PageSpeed Insights. Please try again later.</p>');
            }
        });
    });

    // Function to convert score to percentage
    function convertScoreToPercentage(score) {
        return Math.round(score * 100);
    }

    // Function to convert score to letter grade
    function convertScoreToGrade(score) {
        if (score >= 0.9) return 'A';
        if (score >= 0.8) return 'B';
        if (score >= 0.7) return 'C';
        if (score >= 0.6) return 'D';
        return 'F';
    }

    // Function to display PageSpeed Insights data
    function displayPageSpeedData(data) {
        var output = '<div class="pagespeed-data">';
        output += '<h2>PageSpeed Insights Data</h2>';

        // Display Loading Experience data
        output += '<h3>Loading Experience</h3>';
        output += '<p>Initial URL: ' + data.loadingExperience.initial_url + '</p>';

        // Display Lighthouse Result data
        output += '<h3>Lighthouse Result</h3>';
        output += '<p>Requested URL: ' + data.lighthouseResult.requestedUrl + '</p>';
        output += '<p>Lighthouse Version: ' + data.lighthouseResult.lighthouseVersion + '</p>';
        output += '<p>User Agent: ' + data.lighthouseResult.userAgent + '</p>';
        output += '<p>Fetch Time: ' + data.lighthouseResult.fetchTime + '</p>';

        // Group audits by displayValue
        var definedAudits = [];
        var undefinedAudits = [];

        $.each(data.lighthouseResult.audits, function (key, audit) {
            if (audit.displayValue !== undefined && audit.displayValue !== null) {
                definedAudits.push(audit);
            } else {
                undefinedAudits.push(audit);
            }
        });

        // Sort defined audits by score in ascending order
        definedAudits.sort(function (a, b) {
            return a.score - b.score;
        });

        // Display defined audits
        output += '<h3>Defined Audits</h3>';
        output += '<div class="defined-audits">';
        $.each(definedAudits, function (index, audit) {
            var scorePercentage = convertScoreToPercentage(audit.score);
            var grade = convertScoreToGrade(audit.score);

            output += '<div class="audit">';
            output += '<div class="grade-scale ' + grade + '">' + grade + '</div>';
            output += '<h4>' + audit.title + '</h4>';
            output += '<p>' + audit.description + '</p>';
            output += '<p>Score: ' + scorePercentage + '%</p>';
            output += '<p>Display Value: ' + audit.displayValue + '</p>';
            output += '</div>';
        });
        output += '</div>';

        // Display undefined audits
        output += '<h3>Undefined Audits</h3>';
        output += '<div class="undefined-audits">';
        $.each(undefinedAudits, function (index, audit) {
            var scorePercentage = convertScoreToPercentage(audit.score);
            var grade = convertScoreToGrade(audit.score);

            output += '<div class="audit">';
            output += '<div class="grade-scale ' + grade + '">' + grade + '</div>';
            output += '<h4>' + audit.title + '</h4>';
            output += '<p>' + audit.description + '</p>';
            output += '<p>Score: ' + scorePercentage + '%</p>';
            output += '<p>Display Value: ' + (audit.displayValue || 'N/A') + '</p>';
            output += '</div>';
        });
        output += '</div>';

        output += '</div>';

        $('#pagespeed-results').html(output); // Display results
    }
});