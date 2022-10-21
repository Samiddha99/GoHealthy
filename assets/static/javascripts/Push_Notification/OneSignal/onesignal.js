

let externalUserId = $("#display-username").text();
window.OneSignal = window.OneSignal || [];
OneSignal.push(function() {
    OneSignal.init({
        appId: "6113d9f8-ed30-4dd6-adb4-2d311af9d27b",
    });
    OneSignal.setExternalUserId(externalUserId);
    //OneSignal.showSlidedownPrompt();
    //OneSignal.showCategorySlidedown();
});