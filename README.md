# Tizen Wearable Web Common
Tizen Wearable Web application common components

## Introduction
I've developed tizen apps since Gear 2.0. And now I want to share some of my code base, mostly common for my apps. If someone is still interested in Web apps coding (poor you), you can feel free to use this codes.

At this moment codes are not documented and described. No samples. But I will change it soon.

Please, don't be rude - I hate javascript and if you want to support very old devices, you have to stay old javascript.

### Compatibility
All codes works from Gear 1 till Galaxy Watch Active, so main purpose is backward compatibility.

### Base
Project built with rather old tizen libs, but they work stable (v0.13.29, it's libs from Gear S2 or Tizen 3.0. I don't remember). Also jquery requires. jquery-3.3.1 is ok. Every component can use Utils library, so it's important to download and include it either. If some code don't use it, next update I can rely on it either.



## Valuable code
### ActionMenu
ActionMenu shows circular menu for circle devices and popup for rectangular.
Creation: 
```
var actionMenu = new ActionMenu('actionMenuPageName', 'actionMenuName', itemsList);
```
actionMenuPageName - page name, which menu will create to draw itsels
actionMenuName - name of menu component
itemsList - array of items in following format:
```
[{name : 'unique name of menu item', title : 'display name', image : 'path to icon', onclick : function(){ alert('this will be fired on click')}]
```
Get menu items:
`actionMenu.menuItems`. Array of menu items
`actionMenu.getMenuItemByName`. Find menu item by name or undefined


Menu items visibility:
`actionMenu.showMenuItem('itemName');`
`actionMenu.hideMenuItem('menuName');`

Check menu is opened:
`actionMenu.isOpened`. Returns true or false

Open menu:
`actionMenu.show();`

Close menu:
`actionMenu.close(function(){ alert('Fires when menu is closed');});`. Argument is optional.

Icons guide:
The best option to create icon is to create 32x32 icon and make empty space around to make it 48x48. System will crop icon, but it would be visible good.

NOTE!
1. Always add check if menu isOpened to `tizenhwkey.back` processing event like this:
```
document.addEventListener('tizenhwkey', function(e){
  if (e.keyName === 'back'){
    if (actionMenu.isOpened === true){
      actionMenu.close();
      return;
    }
    //YOUR CODE
  }
}
```
2. Use `lib\tau'wearable\theme\default\tau.circle-patch-0.0.0.1.min.css` from this project instead of system `tau.circle.min.css` to avoid display bug.

3. Init menu on window.load event because it adds markup in code.

Known bugs:
When you open menu from page 'A', and menu item opens input (from this project), page 'A' would receive 'pagehide' and then 'pageshow' event when input opens.

### Circle-helper
Patch for Tizen circle-helper allows to force bezel rotation for element. Anyway not working with virtual-list

### CircleProgress
Small wrapper around progress bar

### ContextMenu
Different click events around item (probably list item). Supports click, click hold, long tap.

### SwipeList
Tiny wrapper around system swipe list

### ToastMessage
Tiny wrapper around system toast

### VirtualList
Patched system virtual list allowing dynamic content f.e. when you refresh data. Highly unrecommended to use it, works really bad especially when list item size is not the same

### Log
Tiny wrapper around console. Just like android log syntax

### SAP
Wrapper around samsung accessory protocol. Android part codes I will add later. Utilizes connection, reconnection, sending data etc

### Utils
Different methods and everything else. Usually needed for other components

### GearHttp
Network utilization module. It sends web requests through XMLHttpRequest for devices newer then Gear 2.0, for Gear 2.0 it passthrough requests through Android phone. You can always force traffic through Android via flag (can be useful when ssl sertificates don't work with particular watch model). It also needs Android part of code I'll share later

### Input
Input draws input window and handles input from all watch generation. For Gear 2.0 it requires TypeGear app, for Gear S it draws rectangular input window, for cirle devices other

### Bonus
You can find lib/tau/wearable/theme/default/tau.circle-patch-0.0.0.1.min.cs which fixes circular menu icons bug, when they grow full screen. You know.
