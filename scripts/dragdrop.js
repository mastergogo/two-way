$(document).ready(function () {
    var selectedButton, selectedDropArea;
    $('.dragItem').on('click keyup', function (e) {
        const key = e.which || e.keyCode;
        if((key === 13 || key === 32) || e.type === 'click'){
            e.stopPropagation();
            if(selectedDropArea){ //Logic to if dropArea is tabbed/clicked first
                if ($('#' + selectedDropArea).children('.dragItem').length > 0) {
                    $('.dragItemsWrapper').append($('#' + selectedDropArea).children('.dragItem:first'));
                }
                $('#' + selectedDropArea).append($(this));
                $(this).focus();
                setLiveRegion($(this).text() + ' dropped to ' + $('#' + selectedDropArea).find('span.sr-only').text());
                toggleSubmitBtn();
                setTimeout(function() {
                    selectedDropArea = null;
                }, 0);
                return;
            }
            if ($(this).attr('aria-disabled') == 'true') {
                clearSelection();
                return;
            }
            $('.dragItem')
                .addClass('disabled')
                .attr({
                    'aria-disabled': true,
                    'tabindex': -1
                });
            
            selectedButton = $(this).attr('id');
            setLiveRegion($('#' + selectedButton).text() + ' grabbed');
            $(this).attr({
                'aria-disabled': false,
                'draggable': false,
                'aria-pressed':true,
                'tabindex': 0
            })
            .removeClass('disabled');
        }
    });

    $('.dropAreaWrapper .dropArea, .dragContainer').on('click keyup', function (e) {
        const key = e.which || e.keyCode;
        if((key === 13 || key === 32) || e.type === 'click'){
            if($(this).hasClass('dropArea') && $('.dragItem[aria-disabled=true]').length === 0){
                //Logic to if dropArea is tabbed/clicked first
                selectedDropArea = $(this).attr('id');
                $('.dragContainer').focus();
                return;
            }
            if ($('.dragItem[aria-disabled=true]')) {
                if ($(this).children('.dragItem').length > 0) {
                    $('.dragItemsWrapper').append($(this).children('.dragItem:first'));
                }

                $(this).hasClass('dragContainer') ? $(this).find('.dragItemsWrapper').append($('#' + selectedButton)) : $(this).append($('#' + selectedButton));

                $('.dragItem')
                    .removeClass('disabled')
                    .attr({
                        'aria-disabled': false,
                        'tabindex': 0
                    });
                $('#' + selectedButton).focus();
                $('#' + selectedButton).attr({
                    'aria-pressed': false,
                    'draggable': true
                });

                toggleSubmitBtn();
                selectedButton && setLiveRegion($('#' + selectedButton).text() + ' dropped to ' + $(this).find('span.sr-only').text());

                selectedButton = null;
            }
        }
    });

    $(document).on('keyup', function (e) {
        if (e.key === 'Escape') {
            if ($('.dragItems[aria-disabled=true]')) {
                clearSelection();
                return;
            }
        }
    });

    $('.dragItemsWrapper .dragItem').on('dragstart', function(event) {
        event.originalEvent.dataTransfer.setData('text', event.target.id);
    });

    $('.dropAreaWrapper .dropArea').on('dragenter', function () {
        $(this).addClass('over');
    });

    $('.dropAreaWrapper .dropArea').on('dragleave dragend', function () {
        $(this).removeClass('over');
    });

    $('.dropAreaWrapper .dropArea, .dragContainer').on('dragover', function(event) {
        event.preventDefault();
    });

    $('.dropAreaWrapper .dropArea, .dragContainer').on('drop', function(event) {
        event.preventDefault();
        const data = event.originalEvent.dataTransfer.getData('text');

        if($(this).hasClass('dragContainer')) {
            $(this).find('.dragItemsWrapper').append($('#' + data));
        }
        else {
            $(this).append($('#' + data));
            if ($(this).children('.dragItem').length > 1) {
                $('.dragItemsWrapper').append($(this).children('.dragItem:first'));
            }
        }

        toggleSubmitBtn();
    });

    $('#submitBtn').on('click', function(){
        alert('Well done!');
    });

    function toggleSubmitBtn(){
        if($('.dragItemsWrapper .dragItem').length > 0) {
            $('#submitBtn').attr('disabled', true);
        }
        else {
            $('#submitBtn').removeAttr('disabled');
        }
    }
    
    function setLiveRegion(textToDisplay) {
        $('#liveRegion').text(textToDisplay);

        setTimeout(function() {
            $('#liveRegion').text('');
        }, 2500);
    }

    function clearSelection() {
        $('.dragItem').attr({
            'aria-disabled': false,
            'draggable': true,
            'aria-pressed':false,
            'tabindex': 0
        })
        .removeClass('disabled');
        document.activeElement.focus();
        setLiveRegion('Cancelled grabbing ' + $('#' + selectedButton).text());
    }
});