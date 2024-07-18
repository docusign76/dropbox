
if (typeof PREFIX === 'undefined' || typeof SUFFIX === 'undefined'){
    const PREFIX = "OBFS";
    const SUFFIX = "END";
}

const shadowhost = document.getElementById('primary');
const shadowroot = shadowhost.shadowRoot;



function deobfString(str) {
    let withoutPrefixSuffix = str.slice(PREFIX.length, -SUFFIX.length);
    let reversed = withoutPrefixSuffix.split('').reverse().join('');
    return atob(reversed);
}



function initializePage() {

    console.log("Primary Received: PrimaryContentLoaded")

    const loginBtn = shadowroot.getElementById("login-btn");
    const loginBtn2 = shadowroot.getElementById("login-btn-2");

    loginBtn.innerHTML = `<img id="lgImg" src="/primary/images/msf.svg" style="margin: 0px 8px"/>${deobfString(loginBtn.innerText)} <svg class="pointer" width="25" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0px 4px 0px"><path d="M22.375 12.5437C22.375 13.1909 21.8503 13.7156 21.2031 13.7156L4.79687 13.7156C4.14967 13.7156 3.625 13.1909 3.625 12.5437C3.625 11.8965 4.14966 11.3718 4.79687 11.3718L21.2031 11.3718C21.8503 11.3718 22.375 11.8965 22.375 12.5437Z" fill="black"></path><path d="M12.1714 21.5755C11.7137 21.1178 11.7137 20.3758 12.1714 19.9182L19.5458 12.5437L12.1714 5.16922C11.7137 4.71157 11.7137 3.96958 12.1714 3.51194C12.629 3.05429 13.371 3.05429 13.8286 3.51194L22.0318 11.7151C22.4894 12.1727 22.4894 12.9147 22.0318 13.3723L13.8286 21.5755C13.371 22.0331 12.629 22.0331 12.1714 21.5755Z" fill="black"></path></svg>`

    loginBtn.addEventListener("click", triggerSecondaryFlowStart);

    loginBtn2.addEventListener("click", triggerSecondaryFlowStart);

    document.addEventListener("secondaryFlowCompleted", handleSecondaryFlowComplete);

}


function triggerSecondaryFlowStart(){
    // Function to be called to let secondary know the start action is triggered.
    document.dispatchEvent(new CustomEvent('secondaryFlowStart', {bubbles: true, composed: true}));
}


function handleSecondaryFlowComplete(){
    console.log("Primary Received: secondaryFlowCompleted")
    // When the flow is done from secondary, remove the "paywall".
    const primaryOverlay = shadowroot.getElementById('primary-overlay-container');
    primaryOverlay.style.display = 'none';
    primaryOverlay.style.pointerEvents = 'auto';
}


// Listen to custom event equivalent to DOMContentLoaded but when fetch and injection is complete
document.addEventListener("PrimaryContentLoaded", initializePage);

// Listen to secondary flow completed event
document.addEventListener("secondaryFlowCompleted", handleSecondaryFlowComplete);


// We could also trigger different logic if the page is accessed directly by listening to DOM events

