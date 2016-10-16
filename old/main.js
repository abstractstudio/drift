goog.require("drift.Drift");

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var drift = new Drift(canvas);
    drift.main();
}
