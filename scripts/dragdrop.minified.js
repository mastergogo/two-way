var dragButtons = document.querySelectorAll('button[draggable]'),
    dropZones = document.querySelectorAll('.dropContainer div'),
    mainArea = document.querySelector('#mainArea');
var selectedButton;
$(document).ready(function () {
    $(dragButtons).on('click', function (e) {
        console.log($(this))
        e.stopPropagation();
        if (this.getAttribute('aria-pressed') == 'true') {
            clearSelection();
            return;
        }
        $(dragButtons).attr('disabled', true);

        $(this).attr('disabled', false);
        selectedButton = $(this).attr('id');
        console.log($(dragButtons), selectedButton)
        setLiveRegion(document.getElementById(selectedButton).innerText + ' Grabbed.');
        $(this).attr({
            'aria-pressed': true,
            'draggable': false
        });
    });

    $(mainArea).add(dropZones).on('keyup', function (e) {
        const key = e.which || e.keyCode;
        if (key === 13 || key === 32) {
            if (document.querySelector('button[aria-pressed=true]')) {
                if ($(dropZones).children('button').length > 0) {
                    $(mainArea).append($(dropZones).children('button').eq(0));
                }
                this.insertAdjacentElement('beforeend', document.getElementById(selectedButton));
                $(dragButtons).attr('disabled', false);

                document.getElementById(selectedButton).focus();
                $('#' + selectedButton).attr({
                    'aria-pressed': false,
                    'draggable': true
                })
                setLiveRegion(document.getElementById(selectedButton).innerText + ' Dropped to ' + $(this).attr('aria-label'));
            }
        }
    });

    $(mainArea).add(dropZones).on('click', function (e) {
        if (document.querySelector('button[aria-pressed=true]')) {
            if ($(dropZones).children('button').length > 0) {
                $(mainArea).append($(dropZones).children('button').eq(0));
            }
            this.insertAdjacentElement('beforeend', document.getElementById(selectedButton));
            $(dragButtons).attr('disabled', false);

            document.getElementById(selectedButton).focus();
            $('#' + selectedButton).attr({
                'aria-pressed': false,
                'draggable': true
            })
            setLiveRegion(document.getElementById(selectedButton).innerText + ' Dropped to ' + $(this).attr('aria-label'));
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'Escape') {
            if ($('button[aria-pressed=true]')) {
                clearSelection();
                return;
            }
        }
    });

    $(dragButtons).on('dragstart', function () {
        $(this).css('opacity', '0.5');
    });

    $(dragButtons).on('dragend', function () {
        $(this).removeAttr('style');
    });

    $(dropZones).on('dragenter', function () {
        $(this).addClass('over');
    });

    $(dropZones).on('dragleave dragend', function () {
        $(this).removeClass('over');
    });
});

function clearSelection() {
    $(dragButtons).attr({
        'disabled': false,
        'draggable': true
    });

    document.getElementById(selectedButton).focus();
    document.getElementById(selectedButton).setAttribute('aria-pressed', 'false');
    setLiveRegion('Cancelled grabbing ' + document.getElementById(selectedButton).innerText);
}

function setLiveRegion(textToDisplay) {
    $('#liveRegion').html(textToDisplay);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var target = ev.target.draggable ? ev.target.parentElement : ev.target;
    target.appendChild(document.getElementById(data));
}

function resetView() {
    var planetsDiv = document.querySelector('div[ondrop]');
    for (var i = 0; i < dragButtons.length; i++) {
        planetsDiv.appendChild(dragButtons[i]);
    }
    setLiveRegion('Page has been Reset.');
    if (document.querySelector('button[aria-pressed=true]')) {
        for (var i = 0; i < dragButtons.length; i++) {
            dragButtons[i].disabled = false;
            dragButtons[i].setAttribute('draggable', 'true');
        }

        document.getElementById(selectedButton).setAttribute('aria-pressed', 'false');
        return;
    }

}