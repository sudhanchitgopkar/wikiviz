/**
 * @author Sudhan Chitgopkar <hi@sudhan.dev>
 * Algo for visualizing wiki's internal links.
 * Authored solely by Sudhan Chitgopkar.
 */

var font;
var articles = [];
var adjMat = [];
var selected = 0;
var paused = false;
var currPos = 0;
var adjMap = new Map();

//preload necessary to prevent font loading before initializing
function preload() {
  font = loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
  );
} //preload

function disp(a) {
  fill(map(a.layer, 0, 3, 0, 255), 255, 255, 0.3);
  stroke(255, 0, 255, 0.5);
  push();
  translate(a.x, a.y, a.z);
  sphere(a.len, 10, 10);
  fill(255);
  textSize(a.len / 2);
  text(a.title, 0, a.len + 10);
  pop();
}

function initArticles() {
  var seen = new Set();
  for (const val of adjMap.values()) {
    for (var i = 0; i < val.length; i++) {
      calcCoords(val[i]);
      if (!seen.has(val[i])) articles.push(val[i]);
      seen.add(val[i]);
    } //for
  } //for
} //initArticles

function calcCoords(a) {
  a.x = map(a.layer, 0, 3, -width / 6, width / 6);
  a.y = random(-height / 3, height / 3); //map(a.id, 0, 20, -height / 3, height / 3);
  a.z = random(-height / 3, height / 3);
} //dispArticle

function makeAdjMatrix() {
  for (var i = 0; i < articles.length; i++)
    adjMat.push(new Array(articles.length));

  for (var i = 0; i < articles.length; i++)
    for (var j = 0; j < articles.length; j++) if (i < j) adjMat[i][j] = 1;
} //makeAdjMatrix

function drawArticles() {
  //draw node
  stroke(255, 0, 255, 0.1);
  for (var i = 0; i < articles.length; i++) {
    if (i == selected) {
      noFill();
      stroke(137, 255, 100);
      strokeWeight(3);
      push();
      translate(articles[i].x, articles[i].y, articles[i].z);
      box(articles[i].len * 2);
      pop();
      stroke(255);
      strokeWeight(1);
    }

    disp(articles[i]);
    fill(map(articles[i].layer, 0, 3, 0, 255), 255, 255);
  } //for

  strokeWeight(3);
  //draw connection
  for (const val of adjMap.values()) {
    var key = val[0];
    for (var i = 1; i < val.length; i++) {
      stroke(map(articles[i].layer, 0, 3, 0, 255), 255, 255);
      line(key.x, key.y, key.z, val[i].x, val[i].y, val[i].z);
    } //for
  } //for

  stroke(255);
  strokeWeight(1);

  noFill();
  box(width / 2.7);
} //drawArticles

function showDetails() {
  fill(255);
  var message =
    "Article Title: " +
    "\n" +
    articles[selected].title +
    "\nLayer: " +
    articles[selected].layer;
  if (articles[selected].id < 0)
    message += "\nThis page has not yet been created.";
  push();
  textSize(12);
  text(message, width / 3.2, -height / 2.2);
  pop();
}

function setup() {
  //canvas setup
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);

  //anim setup
  frameRate(60);

  //text setup
  textFont(font);

  //color setup
  colorMode(HSB);
  stroke(255);
  fill(100, 100, 100, 0.2);

  //populateData
  adjMap = myAdjacencyMap();
  initArticles();
} //setup

function draw() {
  push();
  translate(0, 0, width / 2 - mouseX);
  if (mouseIsPressed) rotateY(map(mouseX, 0, width, 0, TWO_PI));
  if (!paused) rotateY(millis() / 4000);
  else rotateY(currPos / 4000);
  background(0);
  drawArticles();
  pop();
  showDetails();
  fill(255);
  stroke(255);
} //draw

/*
function mousePressed() {
  for (var i = 0; i < articles.length; i++) articles[i].clicked();
}
*/

function keyTyped() {
  if (keyCode === ENTER) {
    window.open("http://en.wikipedia.org/?curid=" + articles[selected].id);
  } else if (key === "a") {
    background(255, 0, 0);
    selected = selected == 0 ? articles.length - 1 : selected - 1;
  } else if (key === "d") {
    selected = selected == articles.length - 1 ? 0 : selected + 1;
  } else if (key === "s") {
    paused = !paused;
    currPos = millis();
  }
}
