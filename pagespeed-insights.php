<?php
/*
Plugin Name: PageSpeed Insights
Plugin URI: https://example.com/
Description: A plugin to integrate Google PageSpeed Insights with a shortcode for easy analysis and display of results.
Version: 1.0
Author: Your Name
Author URI: https://example.com/
License: GPL2
*/

// Enqueue JavaScript and CSS files
function psi_enqueue_scripts() {
    wp_enqueue_script('pagespeed-script', plugins_url('/pagespeed-script.js', __FILE__), array('jquery'), null, true);
    wp_enqueue_style('pagespeed-style', plugins_url('/pagespeed-style.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'psi_enqueue_scripts');

// Define the shortcode
function pagespeed_insights_shortcode() {
    ob_start();
    ?>
    <div class="pagespeed-data">
        <h2>Nfinite Performance Test</h2>
        <form method="post" id="pagespeed-form">
            <label for="url">Enter URL:</label>
            <input type="text" id="url" name="url" required>
            <button type="submit" name="submit">Analyze</button>
        </form>
        <div id="pagespeed-spinner" style="display: none;">
            <i class="fa fa-spinner fa-spin"></i> Loading...
        </div>
        <div id="pagespeed-results"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('pagespeed_insights', 'pagespeed_insights_shortcode');