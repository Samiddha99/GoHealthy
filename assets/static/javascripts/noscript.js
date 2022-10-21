let referer_url = document.referrer
if(referer_url == '' || referer_url == null || referer_url == undefined){
    referer_url = window.location.host
}
if((!referer_url.startsWith("http://")) || (!referer_url.startsWith("https://"))){
    referer_url = `http://${referer_url}`
}
location.replace(referer_url)