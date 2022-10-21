self.addEventListener('message', function(e) {
    var receivedData = e.data;

    function addPagination(total, currentPage){
        var p = ''
        let start = 1
        let dotAdded = false
        if(currentPage > 3 && currentPage <= total-3 && total >= 7){
            start = currentPage-2
        }
        for(i=start; i<=total; i++){
            var ele = ''
            if((i <= start+2)){
                if(currentPage == i){
                    ele = `<li class="page-item active" id="page-${i}" data-value=${i} style="cursor: pointer"><span class="page-link">${i}</span></li>`
                }
                else{
                    ele = `<li class="page-item" id="page-${i}" data-value=${i} style="cursor: pointer"><span class="page-link">${i}</span></li>`
                }
            }
            if(!dotAdded && i > start+2 && total >= 7){
                dotAdded = true
                ele = `<li class="page-item disabled"><span class="page-link">......</span></li>`
            }
            if(i > total-3){
                if(currentPage == i){
                    ele = `<li class="page-item active" id="page-${i}" data-value=${i} style="cursor: pointer"><span class="page-link">${i}</span></li>`
                }
                else{
                    ele = `<li class="page-item" id="page-${i}" data-value=${i} style="cursor: pointer"><span class="page-link">${i}</span></li>`
                }
            }
            p += ele
        }
        return p;
    }

    var html = `<nav aria-label="Page navigation example">
                    <ul class="pagination justify-content-end">
                    ${receivedData['total_page'] == 1 || receivedData['current_page'] == 1 ? '<li class="page-item disabled" id="page-previous" data-value="previous"><a class="page-link" href="#" tabindex="-1"><i class="fas fa-angle-double-left text-primary"></i></a></li>' : '<li class="page-item" id="page-previous" data-value="previous"><a class="page-link" href="#" tabindex="-1"><i class="fas fa-angle-double-left text-primary"></i></a></li>'}
                    ${addPagination(total=receivedData['total_page'], currentPage=receivedData['current_page'])}
                    ${receivedData['total_page'] == 1 || receivedData['current_page'] == total ? '<li class="page-item disabled" id="page-next" data-value="next"><a class="page-link" href="#" tabindex="-1"><i class="fas fa-angle-double-right text-primary"></i></a></li>' : '<li class="page-item" id="page-next" data-value="next"><a class="page-link" href="#" tabindex="-1"><i class="fas fa-angle-double-right text-primary"></i></a></li>'}
                    </ul>
                </nav>`
            
    self.postMessage(html);
}, false);