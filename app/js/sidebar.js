var toArray = function(arr) {
    return Array.prototype.slice.call(arr)
}

function toggleSubmenu(id) {
    var children = Array.prototype.slice.call(id.parentElement.children).filter(el => el.className === "submenu")
    var expanded = children[0].style.display === "block"
    if (expanded) {
        children.forEach(el => el.style.display = "none")
    } else {
        children.forEach(el => el.style.display = "block")
    }
}

function focusItem(id) {
    unfocusSidebar()
    id.setAttribute("id", "sidebarFocus")
}

function unfocusSidebar() {
    var focus = document.getElementById("sidebarFocus")
    if (focus !== null) {
        focus.setAttribute("id", "")
    }
}

var menuItems = toArray(document.getElementsByClassName('menuHeader'))
var submenuItems = toArray(document.getElementsByClassName('submenuHeader'))
var allMenuItems = menuItems.concat(submenuItems)

document.getElementsByTagName('article').item(0).addEventListener("click", unfocusSidebar)
menuItems.forEach(el => el.addEventListener("click", function() {
    toggleSubmenu(el)
}))

allMenuItems.forEach(el => el.addEventListener("click", function() {
    focusItem(el)
}))
