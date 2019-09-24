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

Don't forget to copy "style.css" to make it looks better (yes, Samsung didn't include all styles into their libraries)



## Valuable code
### ActionMenu
ActionMenu shows circular menu for circle devices and popup for rectangular.
![ActionMenu](/screenshots/actionMenu.png)
1. Install
- copy actionMenu-x.x.x.x.js into your project
- copy utils-x.x.x.x.js into your project
- add links to you html: 
```
<head> 
  <script type="text/javascript" src="js/utils-x.x.x.x.js"></script>
  <script type="text/javascript" src="js/actionMenu-x.x.x.x.js"></script> 
</head>
```
2. Create instance
```
var actionMenu = new ActionMenu('actionMenuPageName', 'actionMenuName', itemsList);
```
actionMenuPageName - page name, which menu will create to draw itsels
actionMenuName - name of menu component
itemsList - array of items in following format:

3. Create menu items
```
[{name : 'unique name of menu item', title : 'display name', image : 'path to icon', onclick : function(){ alert('this will be fired on click')}]
```
4. Work with items
- Get menu items:
`actionMenu.menuItems`. Array of menu items
`actionMenu.getMenuItemByName`. Find menu item by name or undefined

- Change items visibility:
`actionMenu.showMenuItem('itemName');`
`actionMenu.hideMenuItem('menuName');`

5. Work with menu
- Check menu is opened:
`actionMenu.isOpened`. Returns true or false

- Open menu:
`actionMenu.show();`

- Close menu:
`actionMenu.close(function(){ alert('Fires when menu is closed');});`
Argument: function which fires when action menu is closed. Optional.

6. Icons guide
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
Two global methods:

Force create scroller
``createScroller(e)``
e - object with field target contains dom element
Example:
``createScroller({target : document.getElementById('mainPage')})``

Add page to ignore list avoid create scroller
``addScrollerIgnorePage(id)``
id - page name without #
Example: 
``addScrollerIgnorePage('mainPage')``

### CircleProgress
Small wrapper around progress bar

### ContextMenu
Different click events around item (probably list item). Supports click, click hold, long tap.

### SwipeList
Tiny wrapper around system swipe list

### ToastMessage
Tiny wrapper around system toast

![ToastMessage](/screenshots/toastMessage.png)

Create:
``var toastMessage = new ToastMessage('popupToast', 'popupToastContent');``
popupToast - unique name of toast element.
popupToastContent - unique name of toast content element.

Elements are added to document automatically.

Show:
``toastMessage.show('MESSAGE TEXT', 100)``
Arguments:
  - text which will be displayed
  - delay before toast shows. Optional

Close:
``toastMessage.close()``
Also toastMessage will be closed after 2000ms automatically
 

### VirtualList
Patched system virtual list allowing dynamic content f.e. when you refresh data. Highly unrecommended to use it, works really bad especially when list item size is not the same

### Log
Tiny wrapper around console. Just like android log syntax.

Global properties:
```
Log.DEBUG
```
When set to true, debug log will be written. If set to false, no debug log.
```
Log.ITEM
```
Set DOM element to write log into
```
Log.FORCE_ERROR_ALERT
```
When set to true, error will be always alerted

Methods:
Debug
```
Log.debug(d)
Log.d(d)
```
Arguments:
d - debug data

Info
```
Log.info(i, al)
Log.i(i, al)
```
Arguments:
i - log data
al - if set, alert on info

Warn
```
Log.warn(w, al)
Log.w(w, al)
```
Arguments:
w - log data
al - if set, alert on warn

Error
```
Log.error(e, silent)
Log.e(e, silent)
```
Arguments:
e - log data
silent - if not set, alert on error

### SAP
Wrapper around samsung accessory protocol. Android part codes I will add later. Utilizes connection, reconnection, sending data etc

### Utils
Date time methods:
Date extensions:
``toDateInputValue``
Date for filling date input box

``toDisplayDateTime``
Date and time for display without year. Returns dd.mm hh:MM with leading zero

``toDisplayTime``
Time for display without seconds. Returns hh:mm with leading zero

``toDisplayDate``
Date for display without year. Returns dd.mm with leading zero

``toYYYYMMDD``
Returns date in YYYY-MM-DD format

``toYYYYMMDDTHHMM``
Returns date in YYYY-MM-DDThh:mm format

``toYYYYMMDDTHHMMSS``
Returns date in YYYY-MM-DDThh:mm:ss format

TZDate extensions:
``toDisplayTime``
Returns date in hh:mm with leading zero

``toDisplayDate``
Returns date in dd.mm with leading zero

``toYYYYMMDD``
Returns date in YYYY-MM-DD format

``toYYYYMMDDTHHMM``
Returns date in YYYY-MM-DDThh:mm format

``toYYYYMMDDTHHMMSS``
Returns date in YYYY-MM-DDThh:mm:ss format

``toDisplayDateTime``
Returns date in format DD.MM hh:mm with leading zero.

Other methods:
Try parse int from string
``Utils.tryParseInt(str, defaultValue)``
str - string to parse
defaultValue - returns defaultValue, when string cannot be parsed

Get file name without extension from path
``Utils.getFileNameWithoutExtension(fileName)``

Get file name with extension from path
``Utils.getFileName(fileName)``

Get file extension from path
``Utils.getFileExtension(fname)``

Generate random UUID
``Utils.generateUUID``

Append html to div where cursor is
``Utils.appendHtmlAtCaret(html, selectPastedContent)``
html - html should be appended
selectPastedContent - if set to true, new content will be selected

Get random integer between min and max
``Utils.getRandomInt(min, max)``

Get gear version from model. Method not updated since GearS3 because no need and hard to find models codenames list
``Utils.getGearVersion(model)``
Returns enum GearModel.

Check if GearS+. Method is absolete, better check tau.support.shape.circle
``Utils.isNewGear(model)``

Get active page name
``Utils.getActivePage``
Returns currently active page name without #

Convert bytes to size (kb,mb etc) in English locale
``Utils.bytesToSize(bytes)``

Check if object is string
``Utils.isString(object)``

Dynamic sort array with property set
``Utils.dynamicSort(property)``
Example:
`var People = [ {Name: "Name", Surname: "Surname"}, {Name:"AAA", Surname:"ZZZ"}, {Name: "Name", Surname: "AAA"} ]; People.sort(dynamicSort("Name")); 
People.sort(dynamicSort("Surname"));
People.sort(dynamicSort("-Surname"));`

Dynamic sort multiple properties
``Utils.dynamcSortMultiple``
Example:
```
var array = [{name: 'A', date: 11}, {name: 'B', date: 12}];
array.sort(Utils.dynamicSortMultiple('date', '-name'))
```

String extension - starts with string:
``startsWith(str)``
Returns true or false

String to boolean
``Utils.stringToBoolean(val, defaultVal)``
Converts string to boolean or returns defaultValue

Get mime of file name
``Utils.getMime(fileName)``

Get hash code
``Utils.hashCode(string)``


### GearHttp
Network utilization module. It sends web requests through XMLHttpRequest for devices newer then Gear 2.0, for Gear 2.0 it passthrough requests through Android phone. You can always force traffic through Android via flag (can be useful when ssl sertificates don't work with particular watch model). It also needs Android part of code I'll share later

### Input
Input draws input window and handles input from all watch generation. For Gear 2.0 it requires TypeGear app, for Gear S it draws rectangular input window, for cirle devices other

### Bonus
You can find lib/tau/wearable/theme/default/tau.circle-patch-0.0.0.1.min.cs which fixes circular menu icons bug, when they grow full screen. You know.
