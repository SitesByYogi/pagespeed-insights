jQuery(document).ready(function ($) {
    console.log('Document ready'); // Debug statement

    $('#pagespeed-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        console.log('Form submitted'); // Debug statement

        // Show spinner
        $('#pagespeed-spinner').show();

        var url = $('#url').val();
        if (!url) {
            console.error('URL is empty');
            $('#pagespeed-spinner').hide();
            $('#pagespeed-results').html('<p class="error-message">Please enter a URL.</p>');
            return;
        }

        var apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + encodeURIComponent(url);
        console.log('API URL:', apiUrl); // Debug statement

        // Make AJAX request to fetch PageSpeed Insights data
        $.ajax({
            url: apiUrl,
            dataType: 'json',
            success: function (data) {
                console.log('Data received:', data); // Debug statement
                $('#pagespeed-spinner').hide();
                displayPageSpeedData(data); // Call function to display data
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data:', error);
                $('#pagespeed-spinner').hide();
                $('#pagespeed-results').html('<p class="error-message">Error retrieving data from PageSpeed Insights. Please try again later.</p>');
            }
        });
    });

    // Function to convert text with URLs into clickable links
    function convertTextWithLinks(text) {
        if (!text) return '';
        var urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    // Function to convert score to percentage
    function convertScoreToPercentage(score) {
        return Math.round(score * 100);
    }

    // Function to convert score to grade
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
        output += '<p>Initial URL: ' + convertTextWithLinks(data.loadingExperience.initial_url) + '</p>';

        // Display Lighthouse Result data
        output += '<h3>Lighthouse Result</h3>';
        output += '<p>Requested URL: ' + convertTextWithLinks(data.lighthouseResult.requestedUrl) + '</p>';
        output += '<p>Lighthouse Version: ' + data.lighthouseResult.lighthouseVersion + '</p>';
        output += '<p>User Agent: ' + data.lighthouseResult.userAgent + '</p>';
        output += '<p>Fetch Time: ' + data.lighthouseResult.fetchTime + '</p>';

        // Group and display defined audits
        var definedAudits = [];

        $.each(data.lighthouseResult.audits, function (key, audit) {
            if (audit.displayValue !== undefined && audit.displayValue !== null) {
                if (key === 'total-blocking-time') {
                    // Special handling for Total Blocking Time
                    definedAudits.push({
                        title: audit.title,
                        score: audit.score,
                        displayValue: '<a href="https://wpnfinite.com" target="_blank" rel="noopener noreferrer">Get a Free Performance Audit Today! We’ll identify what’s slowing down your site and provide expert recommendations to speed it up.</a>'
                    });
                } else {
                    definedAudits.push(audit);
                }
            }
        });

        // Sort defined audits by score in ascending order
        definedAudits.sort(function (a, b) {
            return a.score - b.score;
        });

        output += '<h3>Defined Audits</h3>';
        output += '<div class="defined-audits">';
        $.each(definedAudits, function (index, audit) {
            var scorePercentage = convertScoreToPercentage(audit.score);
            var grade = convertScoreToGrade(audit.score);

            output += '<div class="audit">';
            output += '<div class="grade-scale ' + grade + '">' + grade + '</div>';
            output += '<h4>' + audit.title + '</h4>';
            output += '<p>Score: ' + scorePercentage + '%</p>';
            output += '<p>' + audit.displayValue + '</p>'; // Display the HTML link directly
            output += '</div>';
        });
        output += '</div>';

        output += '</div>';

        $('#pagespeed-results').html(output); // Display results
    }
});