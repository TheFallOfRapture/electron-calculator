const {shell} = require('electron')

var toArray = function(arr) {
    return Array.prototype.slice.call(arr)
}

document.getElementById("materialLink").addEventListener("click", function() {
    shell.openExternal("http://material.google.com")
})
