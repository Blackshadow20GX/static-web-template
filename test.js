#!/usr/bin/env node

//Instance variables//

//Directory and file path parameters
const PAGES_PATH = 'dist/**/index.html'; 
const ROBOTS_PATH = './dist/robots.txt';
const ASSETS_PATH = './dist/';
const SITEMAP_PATH = './dist/sitemap.xml';
const FOUR_OH_FOUR_PATH = './dist/404.html';
const SEO_SUITE_PATH = './test_suites/seo/';
const STANDARD_SUITE_PATH = './test_suites/standard/';

//Test Suite Functions
//Standard Suite funciton files
const STANDARD_SUITE_IMG = require(STANDARD_SUITE_PATH + 'test_pages_img');
const STANDARD_SUITE_HREF = require(STANDARD_SUITE_PATH + 'test_pages_href'); 

//SEO Suite function files
const SEO_SUITE_META = require(SEO_SUITE_PATH + 'test_pages_meta');
const SEO_SUITE_ROBOTS = require(SEO_SUITE_PATH + 'test_robots_txt');
const SEO_SUITE_SITEMAP = require(SEO_SUITE_PATH + 'test_sitemap_xml');
const SEO_SUITE_FOUR_OH_FOUR = require(SEO_SUITE_PATH + 'test_404_html');

//Colours for fonts
const SUCCESS_COLOUR = "\x1b[32m";
const FAILURE_COLOUR = "\x1b[31m";
const RESET_COLOUR = "\x1b[0m";
const UNDERSCORE = "\x1b[4m";
const BRIGHT = "\x1b[1m";


//Begin main function
execute();

//Main function
function execute(){
  //Run all suites specified
  standard_suite();
  console.log(); //New line formatting
  seo_suite();
};

//Helper function for performing all standard suite tests
function standard_suite(){
  console.log(declaration('Commencing Standard Suite'));
  STANDARD_SUITE_HREF.test_pages_href(PAGES_PATH, success, failure);
  STANDARD_SUITE_IMG.test_pages_img(PAGES_PATH, ASSETS_PATH, success, failure);
  console.log(declaration('Standard Suite Complete!'));
};

//Helper function for performing all SEO suite tests
function seo_suite(){
  console.log(declaration('Commencing SEO Suite'));
  SEO_SUITE_ROBOTS.test_robots_txt(ROBOTS_PATH, success, failure);
  SEO_SUITE_META.test_pages_meta(PAGES_PATH, success, failure);
  SEO_SUITE_SITEMAP.test_sitemap_xml(SITEMAP_PATH, success, failure);
  SEO_SUITE_FOUR_OH_FOUR.test_404_html(FOUR_OH_FOUR_PATH, success, failure);
  console.log(declaration('SEO Suite Complete!'));
};

//Helper function for displaying declaration text
function declaration(text){
  return UNDERSCORE + text + RESET_COLOUR;
};

//Helper function for displaying success text
function success(text){
  return SUCCESS_COLOUR + BRIGHT + 'Complete! : ' + RESET_COLOUR + SUCCESS_COLOUR + text + RESET_COLOUR;
};

//Helper function for displaying failure text
function failure(text){
  return FAILURE_COLOUR + text + RESET_COLOUR;
};